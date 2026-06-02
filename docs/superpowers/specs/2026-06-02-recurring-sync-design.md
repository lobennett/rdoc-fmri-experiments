# Design: recurring Dropbox→Supabase sync + `n_trials`→`n_records`

**Date:** 2026-06-02
**Status:** Approved (brainstorming)
**Repo:** `rdoc-fmri-experiments` (extends the `rdoc_sync` package)

## Goal

Add a scheduled, idempotent Dropbox→Supabase sync so the `runs` table stays current without manual steps, and rename the misleading `n_trials` column to `n_records`.

## Background / current state

- `rdoc_sync` already has `sync` (ingest local `.output` → Supabase + Dropbox) and `backfill --staging` (ingest a staging dir; supports `--skip-dropbox`). Supabase upserts are idempotent on `(subject_id, session, run, task, date_time)`; `rclone copy` skips unchanged files.
- The canonical corpus lives in Dropbox at `<DROPBOX_REMOTE>` (`poldracklab_db:rdoc_fmri_behavior/output`), under `raw/`. `rdoc_sync/.env` holds Supabase creds + `DROPBOX_REMOTE`; rclone is configured on this machine.
- The `runs` table had a column `n_trials = len(trialdata)`. "Trials" is misleading: `trialdata` is the jsPsych data array where every logged screen (instructions, fixations, ITIs, feedback, task trials) is one object, so the count is really the number of records/rows, not experimental trials.
- **The Supabase column has already been renamed to `n_records`** (user applied `ALTER TABLE runs RENAME COLUMN n_trials TO n_records;`). The code still writes `n_trials`, so it must be updated in lockstep or upserts will fail on the missing column.

## Deliverable 1: `n_trials` → `n_records` rename (code)

- `rdoc_sync/runs_table.sql`: `n_trials` → `n_records` (for fresh installs).
- `rdoc_sync/src/rdoc_sync/parse.py`: `RunRecord.n_trials` → `n_records`; `n_records=len(trials)`.
- `rdoc_sync/src/rdoc_sync/payload.py`: payload key `"n_trials"` → `"n_records"`.
- `rdoc_sync/tests/test_parse.py`, `test_payload.py`: update field/key names.
- `rdoc_sync/migrations/001_rename_n_trials_to_n_records.sql`: committed record of the migration the user already ran:
  ```sql
  alter table runs rename column n_trials to n_records;
  ```
- No other column/field semantics change.

## Deliverable 2: `rdoc-sync from-dropbox` command (Supabase-only)

A pull-and-ingest command for recurring Dropbox→Supabase sync:

1. **Pull:** `rclone copy <DROPBOX_REMOTE>/raw <staging>/raw` into a persistent staging dir (default `~/.cache/rdoc-sync/staging`, overridable via `--staging`). Incremental: after the first run only new/changed files download.
2. **Ingest:** the existing `run_sync(...)` with `skip_dropbox=True`, `hostname=None`, `exp_git_sha=None` (same as `backfill`), upserting to Supabase.

Design:
- A testable core `from_dropbox(*, remote, staging, client, report_path, dry_run, rclone_runner, ingest)` where `rclone_runner` (the rclone subprocess) and `ingest` (the `run_sync` call) are injected. It builds the rclone command `["rclone", "copy", f"{remote}/raw", str(staging/"raw")]`, invokes `rclone_runner`, then calls `ingest(...)` and returns its result dict augmented with the staging path. Unit-tested with both injected (no network).
- A `main` subcommand `from-dropbox` wiring real `rclone` (subprocess), `build_client` (or None on `--dry-run`), and `run_sync`. Flags: `--staging` (default `~/.cache/rdoc-sync/staging`), `--report` (default `./rdoc-from-dropbox-report.md`), `--dry-run`.
- `from-dropbox` never pushes to Dropbox (source is Dropbox); it is Supabase-only.

## Deliverable 3: launchd nightly agent (this machine)

- `rdoc_sync/launchd/com.poldracklab.rdoc-sync.plist` — a LaunchAgent that runs the sync nightly at 03:00 via `StartCalendarInterval`, with:
  - `ProgramArguments`: `/opt/homebrew/bin/uv run rdoc-sync from-dropbox`
  - `WorkingDirectory`: this machine's `rdoc_sync` dir (`/Users/lobennett/grants/r01_rdoc/projects/rdoc-fmri-experiments/rdoc_sync`)
  - `StandardOutPath`/`StandardErrorPath`: `~/Library/Logs/rdoc-sync.log` (absolute, expanded)
  - `RunAtLoad`: false
- The committed plist carries this machine's absolute paths; the README documents adjusting `WorkingDirectory`/uv path for other machines.
- Install (user-gated, touches `~/Library/LaunchAgents` + the real DB): copy the plist to `~/Library/LaunchAgents/`, then `launchctl load ~/Library/LaunchAgents/com.poldracklab.rdoc-sync.plist`. The README gives these commands plus how to unload.

## Deliverable 4: docs

`rdoc_sync/README.md` gains:
- A "Recurring sync" section: the `from-dropbox` command (pull + Supabase-only upsert, incremental), and the launchd install/uninstall steps + log location.
- A note that the metadata column is `n_records` (count of jsPsych objects in `trialdata`, not just experimental trials) and that `migrations/001_…sql` records the rename.

## Error handling

- `from_dropbox` surfaces a non-zero rclone exit clearly (the pull failing means nothing to ingest); ingest failures are reported per the existing `run_sync` failure accounting and non-zero exit.
- The launchd job logs stdout/stderr to the log file; a failed nightly run is visible there and is safely retried the next night (idempotent).

## Testing

pytest, no network/GUI:
- rename: `test_parse.py`/`test_payload.py` assert `n_records` (field + payload key); full suite green.
- `from_dropbox`: injected `rclone_runner` records the `rclone copy <remote>/raw <staging>/raw` command; injected `ingest` records that it was called with `skip_dropbox=True`; assert order (pull before ingest) and the returned dict.
- launchd plist validated with `plutil -lint` (well-formed plist).
- Live: applying the migration (done), installing the agent, and a real `from-dropbox` run are user-gated.

## Non-goals

- No change to `sync` (local→Supabase+Dropbox) or the launch path.
- `from-dropbox` is Supabase-only by design.
- Reconciling legacy data labels (`pretouch1`) and re-cleaning Dropbox remain separate follow-ups.

## Validation criteria

- After the rename, `uv run pytest` passes and a sync upserts rows into the `n_records` schema without error.
- `rdoc-sync from-dropbox` pulls `raw/` incrementally and upserts to Supabase only; re-running changes no row counts.
- The plist passes `plutil -lint`; loading it schedules a nightly run logging to `~/Library/Logs/rdoc-sync.log`.
