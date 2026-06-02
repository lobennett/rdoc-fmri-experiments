# Design: RDoC data sync — Supabase + Dropbox (`rdoc-sync`)

**Date:** 2026-06-01
**Status:** Approved (brainstorming)
**Repo:** `rdoc-fmri-experiments`
**Scope:** Project B of a 4-project decomposition (A: module cleanup — DONE; B: this; C: counterbalancing workflow; D: experiments README + Karabiner).

## Goal

Replace the manual, machine-dependent `rsync.sh` with an automatic, idempotent sync that pushes each experiment run to two destinations from any machine: **Supabase** (Postgres — a queryable run database holding metadata + trial data as JSONB) and **Dropbox** (via `rclone` — the canonical raw/bids file tree). Backfill the existing ~9,172-file corpus into Supabase one time.

## Background / current state

- Data is produced by `expfactory_deploy_local` into a local `.output/{raw,bids}` tree: `raw/sub-<id>/ses-<ses>/…_dateTime-<unix>.json` (the raw payload, containing a `trialdata` JSON array) and `bids/sub-<id>/ses-<ses>/func/…csv` (events; only for `__fmri` tasks).
- Today `rsync.sh` manually copies `.output/` to Dropbox. It fails when run on a machine without the Dropbox mount/rclone, so data sometimes isn't synced.
- The canonical corpus lives in Dropbox at `poldracklab_db:rdoc_fmri_behavior/output` (~9,172 files / ~1.9 GiB), recently de-duplicated/cleaned. No Supabase/Postgres setup exists yet; no `.env` files.
- A corpus audit found subject/session naming inconsistencies (`sub-11` vs `sub-s11`, mislabeled sessions) that a manual rsync can't catch.

## Architecture

A new standalone tool **`rdoc-sync`** in this repo (uv-managed Python package with a CLI). It is RDoC-specific (knows the BIDS layout, schema, destinations), so the generic `expfactory_deploy_local` module is **not** touched. It reads a local `.output` tree and pushes to Supabase + Dropbox. Live sync and backfill use the same ingest code path.

Proposed layout:
```
rdoc-fmri-experiments/
  rdoc_sync/
    pyproject.toml
    src/rdoc_sync/
      cli.py          # `rdoc-sync` entry point (sync / backfill subcommands)
      config.py       # load .env -> typed Settings (Supabase URL/key, Dropbox remote)
      discover.py     # walk .output/raw for run JSON files
      parse.py        # raw JSON -> RunRecord (metadata + trialdata)
      normalize.py    # canonicalize ids/sessions; produce flags (never blocks)
      supabase_client.py  # upsert RunRecord into `runs`
      dropbox_push.py # rclone copy of raw+bids files
      report.py       # anomaly report writer
    tests/
  .env.example        # committed template
  .env                # gitignored, per-machine
```

## Supabase schema — single `runs` table

One row per experiment run. **Unique key:** `(subject_id, session, run, task, date_time)` → idempotent upserts (safe to re-run live sync and backfill).

| column | type | source |
|---|---|---|
| `subject_id` | text | filename (normalized to `sNN`) |
| `session` | text | filename (e.g. `1`, `prescan3`, `pretouch`, `anat`, `4makeup`) |
| `run` | text | filename |
| `task` | text | filename (e.g. `stroop_rdoc__fmri`) |
| `is_practice` | bool | `_practice` in task |
| `is_fmri` | bool | `__fmri` in task |
| `date_time` | timestamptz | filename `dateTime` unix (fallback: inner `dateTime`) |
| `design_perm` | int (nullable) | from `trialdata` (constant within run) |
| `motor_perm` | int (nullable) | from `trialdata` |
| `n_trials` | int | `len(trialdata)` |
| `hostname` | text (nullable) | `socket.gethostname()` for live; null for backfill |
| `exp_git_sha` | text (nullable) | experiments-repo HEAD at collection (live); null for backfill |
| `raw_path` | text | relative canonical raw path |
| `bids_path` | text (nullable) | relative canonical bids path (null if no bids file) |
| `source_filename` | text | original filename |
| `flags` | text[] (or jsonb) | anomaly notes from normalize (empty if clean) |
| `synced_at` | timestamptz | sync time |
| `trialdata` | jsonb | the full trial array from the raw JSON |

Private project; **service-role key** held in the gitignored `.env`; RLS off; single table for now. Per-trial querying is done with Postgres JSON functions (`jsonb_array_elements`) — no per-trial table (YAGNI; can be added later).

## Ingest pipeline (one responsibility per module, unit-testable)

1. **discover** — walk `.output/raw/**/*.json`, yield file paths.
2. **parse** — load raw JSON; extract `trialdata` (array), `exp_id`, `design_perm`/`motor_perm` (from first trial that has them), and parse the filename into subject/session/run/task/date_time. Returns a `RunRecord`.
3. **normalize** — canonicalize `subject_id` to `sNN` (e.g. `11`→`s11`); validate task against the known task set and session against known patterns (`<int>`, `prescan<int>`, `pretouch`, `anat`, `<int>makeup`, `prescan<int>makeup`). Anything unexpected or auto-corrected is recorded in `flags`. **Never blocks** — the record is still pushed.
4. **push** — (a) `supabase_client.upsert(record)` into `runs` on the unique key; (b) `dropbox_push.copy(raw_path, bids_path)` via `rclone copy` (skips unchanged by size/checksum).
5. **report** — write a summary of flagged records (stdout + a CSV/markdown report file) at the end of a run.

The raw JSON is the source of `trialdata`; the bids CSV path is recorded for linkage but its contents are not re-parsed.

## Config / secrets

Gitignored `.env` in the repo root, loaded by `config.py` into a typed `Settings`:
```
SUPABASE_URL=...
SUPABASE_KEY=...               # service-role key
DROPBOX_REMOTE=poldracklab_db:rdoc_fmri_behavior/output
```
A committed `.env.example` documents these. `.gitignore` gains `.env`. rclone is already configured per machine (`poldracklab_db:`).

## CLI

- `rdoc-sync sync [--output ./.output]` — ingest a local `.output` tree (live use; default after a session).
- `rdoc-sync backfill --staging <dir>` — ingest a staging dir (used for the one-time corpus backfill).
- Both accept `--dry-run` (parse + normalize + report, no writes) and `--report <path>`.

## Backfill (one-time)

1. `rclone copy poldracklab_db:rdoc_fmri_behavior/output <staging>` (~1.9 GiB).
2. `rdoc-sync backfill --staging <staging>` — same ingest path; idempotent upserts; produces the full-corpus anomaly report. Historical rows get `hostname=null`, `exp_git_sha=null`.

## Auto-invoke

`rdoc-sync sync` is runnable manually and is called at the **end of a battery session**. Because Project C reworks the launcher, B delivers the standalone tool plus a documented one-line hook; C wires it into the new launch flow. (Interim: a line can be added to `run.sh`/`setup.py`.)

## Error handling

- Local files are the source of truth and are never modified by sync (rclone copy is one-way local→Dropbox).
- Supabase and rclone pushes are each wrapped so a failure on one record is logged and reported, not fatal to the batch; the run exits non-zero if any record failed so callers notice.
- Network/credential errors surface a clear message; because pushes are idempotent, re-running after fixing connectivity is safe.

## Testing

pytest:
- `parse` — metadata + trialdata extraction across input shapes (dict-wrapped vs bare-list raw payloads, missing `exp_id`, perms present/absent).
- `normalize` — canonicalization + flagging, incl. a `sub-11`→`s11` flagged case and a legit `ses-pretouch`/`ses-prescan3makeup` passing clean.
- idempotency — re-ingesting the same file yields one row (upsert), asserted against a fake/mocked client.
- push layer — Supabase and rclone **mocked** (no network in tests); assert correct upsert payload and rclone invocation.
- A real-Supabase smoke check is manual (documented), not in CI.

## Non-goals / relationships

- Launch-time *prevention* of bad subject/session ids → **Project C** (the launcher). B only normalizes/flags at ingest.
- The generic `expfactory_deploy_local` module is unchanged (Project A).
- No summary-stat columns (derivable from `trialdata` JSONB later); no per-trial table yet.

## Validation criteria

- `rdoc-sync sync` on a fresh `.output` run inserts/updates exactly one `runs` row per experiment and copies its files to Dropbox; re-running changes nothing (idempotent).
- Backfill ingests the full Dropbox corpus into `runs` and emits an anomaly report; row count matches the number of raw JSON files (minus any hard parse failures, which are reported).
- A `sub-11`-style file lands as `subject_id=s11` with a flag noting the correction.
- Secrets live only in the gitignored `.env`; `.env.example` is committed.
