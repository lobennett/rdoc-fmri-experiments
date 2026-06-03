# rdoc-sync

`rdoc-sync` ingests the `.output` tree and pushes each experiment run to Supabase (`runs` table: metadata + `trialdata` JSONB) and Dropbox (raw+bids files via rclone). Idempotent.

---

## One-time Supabase setup

1. Create a new project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase dashboard and run the contents of [`runs_table.sql`](./runs_table.sql) to create the `runs` table and its indexes.
3. Copy your project URL and **service-role** key from **Project Settings → API** — you will need both in the next step.

---

## Per-machine setup

### 1. Configure credentials

Copy the example env file at the repo root and fill in the three required variables:

```bash
cp .env.example .env
```

`.env` contents:

```
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_KEY=YOUR-SERVICE-ROLE-KEY
DROPBOX_REMOTE=poldracklab_db:rdoc_fmri_behavior/output
```

`.env` is gitignored and must never be committed.

### 2. Configure rclone

Ensure `rclone` is installed and on `PATH`, and that the Dropbox remote is configured:

```bash
rclone listremotes   # should show your remote, e.g. poldracklab_db:
```

If the remote is missing, run `rclone config` to add it.

### 3. Install the tool

```bash
cd rdoc_sync
uv sync
```

---

## Usage

Run all commands from inside `rdoc_sync/`. Commands are prefixed with `uv run`.

### Sync after a session

```bash
uv run rdoc-sync sync
```

This ingests `./.output` by default. Because the package lives in `rdoc_sync/`, point `--output` at the repo's output tree when running from there:

```bash
uv run rdoc-sync sync --output ../.output
```

### Flags

| Flag | Command | Default | Description |
|---|---|---|---|
| `--output PATH` | `sync` | `./.output` | Root of the output tree to ingest |
| `--staging PATH` | `backfill` | *(required)* | Local staging directory for backfill corpus |
| `--report PATH` | both | `./rdoc-sync-report.md` | Path to write the anomaly report |
| `--dry-run` | both | off | Parse, normalize, and write report only — no Supabase writes, no rclone calls, and credentials are **not** required |
| `--env PATH` | both | `.env` | Path to the `.env` file |

Exit code is non-zero if any run failed. The anomaly report lists all flagged and failed runs.

---

## Backfill (one-time)

To load the historical corpus from Dropbox into Supabase, download it to a local staging directory and then run `backfill`:

```bash
export PATH="/opt/homebrew/bin:$PATH"
rclone copy poldracklab_db:rdoc_fmri_behavior/output /tmp/rdoc-backfill-staging
cd rdoc_sync && uv run rdoc-sync backfill --staging /tmp/rdoc-backfill-staging --report ../rdoc-backfill-report.md
```

`--staging PATH` is required for `backfill`. Historical rows will have `hostname` and `exp_git_sha` left null (these are only captured during a live `sync`).

---

## Idempotency

Re-running is safe:

- **Supabase**: rows are upserted on the unique key `(subject_id, session, run, task, date_time)`. Re-running the same output tree will update existing rows in place rather than inserting duplicates.
- **Dropbox**: rclone skips files that are already present and unchanged.
- **Normalization**: the normalizer canonicalizes subject ids (e.g. `11` → `s11`) and flags anomalies such as unrecognized subject ids or unexpected session values. Flags are written to the anomaly report and stored in the row's `flags` column, but never block ingest.

---

## Recurring sync

### `from-dropbox` command

```bash
uv run rdoc-sync from-dropbox
```

`from-dropbox` rclone-pulls the Dropbox `raw/` tree into a persistent local staging directory (`~/.cache/rdoc-sync/staging` by default) and upserts to Supabase. The pull is incremental — only new or changed files download after the first run, so subsequent runs are fast. Upserts are idempotent.

Because the `.env` file lives at the repo root (one level above `rdoc_sync/`), pass `--env ../.env` when running from inside `rdoc_sync/`, or supply an absolute path:

```bash
uv run rdoc-sync from-dropbox --env ../.env
```

#### Flags

| Flag | Default | Description |
|---|---|---|
| `--staging PATH` | `~/.cache/rdoc-sync/staging` | Local staging directory for the rclone pull |
| `--report PATH` | `./rdoc-sync-report.md` | Path to write the anomaly report |
| `--dry-run` | off | Pull files and parse runs but skip all Supabase writes; credentials not required |
| `--env PATH` | `.env` | Path to the `.env` credentials file |

---

### Nightly schedule (launchd, macOS)

A launchd LaunchAgent plist is provided at `rdoc_sync/launchd/com.poldracklab.rdoc-sync.plist`. It runs `rdoc-sync from-dropbox` nightly at 03:00 local time and appends stdout and stderr to `~/Library/Logs/rdoc-sync.log`. The plist passes an absolute `--env` path pointing at the repo-root `.env` so credentials are found regardless of working directory.

#### Install

```bash
cp rdoc_sync/launchd/com.poldracklab.rdoc-sync.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.poldracklab.rdoc-sync.plist
```

#### Verify and trigger manually

```bash
# confirm the agent is loaded
launchctl list | grep rdoc-sync

# trigger a run immediately (outside the scheduled window)
launchctl start com.poldracklab.rdoc-sync
```

#### Uninstall

```bash
launchctl unload ~/Library/LaunchAgents/com.poldracklab.rdoc-sync.plist
```

#### Notes

- The job runs only while the Mac is awake. If the machine is asleep at 03:00, launchd runs the missed job at the next wake.
- On a different machine, edit the `uv` path (`/opt/homebrew/bin/uv`), `WorkingDirectory`, and the absolute `--env` path in the plist before installing.

---

## `n_records` column note

The `n_records` column in the `runs` table stores the count of jsPsych trial objects in `trialdata` — every logged screen, not only experimental trials. `migrations/001_rename_n_trials_to_n_records.sql` records the rename from the earlier `n_trials` column name.
