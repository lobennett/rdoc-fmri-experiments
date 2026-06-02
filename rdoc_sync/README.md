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
