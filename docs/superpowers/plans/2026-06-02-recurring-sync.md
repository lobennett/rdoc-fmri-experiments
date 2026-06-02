# Recurring Sync + n_records Rename Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the `n_trials` column to `n_records` in `rdoc_sync`, add a Supabase-only `rdoc-sync from-dropbox` pull-and-ingest command, and ship a nightly launchd agent that runs it.

**Architecture:** Extend the existing `rdoc_sync` package. The rename is a mechanical lockstep change (the Supabase column was already renamed by the user). `from-dropbox` rclone-pulls the Dropbox `raw/` tree into a persistent staging dir then reuses the tested `run_sync(..., skip_dropbox=True)` to upsert. A committed launchd plist schedules it nightly.

**Tech Stack:** Python ≥3.11, uv, rclone (subprocess), Supabase (supabase-py), launchd (macOS), pytest.

**Working branch:** `nf-recurring-sync` (off `main` in `rdoc-fmri-experiments`; the spec is committed there). Run `export PATH="/opt/homebrew/bin:$PATH"`. Pytest from inside `rdoc_sync/`.

**Note:** the user has ALREADY run `alter table runs rename column n_trials to n_records;` on Supabase, so the live column is `n_records`; the code below must match it.

---

## File structure

```
rdoc_sync/
  runs_table.sql                         # MODIFY: n_trials -> n_records
  migrations/001_rename_n_trials_to_n_records.sql   # CREATE: record of the applied migration
  src/rdoc_sync/parse.py                 # MODIFY: RunRecord.n_records
  src/rdoc_sync/payload.py               # MODIFY: "n_records" key
  src/rdoc_sync/cli.py                   # MODIFY: from_dropbox() + from-dropbox subcommand
  launchd/com.poldracklab.rdoc-sync.plist# CREATE: nightly LaunchAgent
  README.md                              # MODIFY: recurring sync + n_records note
  tests/test_parse.py                    # MODIFY: n_records
  tests/test_payload.py                  # MODIFY: n_records
  tests/test_cli.py                      # MODIFY: add from_dropbox tests
```

---

## Task 1: Rename `n_trials` → `n_records`

**Files:** Modify `parse.py`, `payload.py`, `runs_table.sql`, `tests/test_parse.py`, `tests/test_payload.py`; Create `migrations/001_rename_n_trials_to_n_records.sql`

- [ ] **Step 1: Update the tests first (they should fail)**

In `rdoc_sync/tests/test_parse.py`, change the two `n_trials` assertions to `n_records`:
- `assert rec.n_records == 2` (in `test_parse_run_dict_payload`)
- `assert rec.n_records == 3 and rec.design_perm is None` (in `test_parse_run_bare_list_payload`)

In `rdoc_sync/tests/test_payload.py`, change `assert p["n_trials"] == 2` to `assert p["n_records"] == 2`.

- [ ] **Step 2: Run to verify they fail**

Run: `cd rdoc_sync && uv run pytest tests/test_parse.py tests/test_payload.py -q`
Expected: FAIL (`AttributeError: 'RunRecord' object has no attribute 'n_records'` and KeyError `n_records`).

- [ ] **Step 3: Rename in `parse.py`**

In `rdoc_sync/src/rdoc_sync/parse.py`: in the `RunRecord` dataclass change the field `n_trials: int` to `n_records: int`; in `parse_run(...)` change `n_trials=len(trials),` to `n_records=len(trials),`.

- [ ] **Step 4: Rename in `payload.py`**

In `rdoc_sync/src/rdoc_sync/payload.py`, change the line `"n_trials": rec.n_trials,` to `"n_records": rec.n_records,`.

- [ ] **Step 5: Rename in `runs_table.sql`**

In `rdoc_sync/runs_table.sql`, change `  n_trials      integer not null default 0,` to `  n_records     integer not null default 0,`.

- [ ] **Step 6: Create the migration record**

Create `rdoc_sync/migrations/001_rename_n_trials_to_n_records.sql`:

```sql
-- Applied 2026-06-02. Renames the misleading n_trials column (it counts every
-- jsPsych record in trialdata -- instructions, ITIs, feedback, task trials --
-- not just experimental trials) to n_records.
alter table runs rename column n_trials to n_records;
```

- [ ] **Step 7: Run the full suite + confirm no stray references**

Run: `cd rdoc_sync && uv run pytest -q`
Expected: all PASS.
Run: `grep -rn "n_trials" rdoc_sync/src rdoc_sync/tests`
Expected: no output (the only remaining mention of `n_trials` is in `migrations/001_…sql`, which is intentional).

- [ ] **Step 8: Commit**

```bash
git add rdoc_sync/src/rdoc_sync/parse.py rdoc_sync/src/rdoc_sync/payload.py rdoc_sync/runs_table.sql rdoc_sync/migrations/001_rename_n_trials_to_n_records.sql rdoc_sync/tests/test_parse.py rdoc_sync/tests/test_payload.py
git commit -m "refactor(rdoc_sync): rename n_trials -> n_records (matches applied migration)"
```

---

## Task 2: `from-dropbox` command (rclone pull + Supabase-only ingest)

**Files:** Modify `rdoc_sync/src/rdoc_sync/cli.py`; Modify `rdoc_sync/tests/test_cli.py`

- [ ] **Step 1: Write the failing test**

Append to `rdoc_sync/tests/test_cli.py`:

```python
def test_from_dropbox_pulls_then_ingests_supabase_only(tmp_path):
    from rdoc_sync.cli import from_dropbox
    calls = {"rclone": None, "ingest": None}

    def rclone_runner(cmd, **kw):
        calls["rclone"] = cmd
        class R:
            returncode = 0
        return R()

    def run_sync_fn(**kwargs):
        calls["ingest"] = kwargs
        return {"n_runs": 5, "n_flagged": 0, "failures": 0}

    staging = tmp_path / "staging"
    result = from_dropbox(remote="remote:base", staging=staging, client="CLIENT",
                          report_path=tmp_path / "r.md", dry_run=False,
                          rclone_runner=rclone_runner, run_sync_fn=run_sync_fn)
    # pulled raw/ from the remote into <staging>/raw
    assert calls["rclone"] == ["rclone", "copy", "remote:base/raw", str(staging / "raw")]
    # ingested the staging dir, Supabase-only
    assert calls["ingest"]["root"] == staging
    assert calls["ingest"]["skip_dropbox"] is True
    assert calls["ingest"]["client"] == "CLIENT"
    assert result["n_runs"] == 5
    assert result["staging"] == str(staging)
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd rdoc_sync && uv run pytest tests/test_cli.py::test_from_dropbox_pulls_then_ingests_supabase_only -q`
Expected: FAIL (`ImportError: cannot import name 'from_dropbox'`).

- [ ] **Step 3: Add `from_dropbox` to `cli.py`**

In `rdoc_sync/src/rdoc_sync/cli.py`, add this function (after `run_sync`):

```python
def from_dropbox(*, remote: str, staging: Path, client: Any, report_path: Path,
                 dry_run: bool, rclone_runner: Callable, run_sync_fn: Callable) -> dict:
    """Pull the Dropbox raw/ tree into a persistent staging dir, then upsert to
    Supabase only (no Dropbox push -- the source IS Dropbox)."""
    staging = Path(staging)
    raw_staging = staging / "raw"
    raw_staging.mkdir(parents=True, exist_ok=True)
    rclone_runner(["rclone", "copy", f"{remote}/raw", str(raw_staging)], check=True)
    result = run_sync_fn(root=staging, client=client, remote=remote,
                         runner=subprocess.run, hostname=None, exp_git_sha=None,
                         report_path=report_path, dry_run=dry_run, skip_dropbox=True)
    result["staging"] = str(staging)
    return result
```

- [ ] **Step 4: Wire the `from-dropbox` subcommand into `main`**

In `main`, add the subparser (next to the `sync`/`backfill` parsers):

```python
    p_from = sub.add_parser("from-dropbox", help="pull Dropbox raw/ and upsert to Supabase (recurring)")
    p_from.add_argument("--staging", type=Path,
                        default=Path.home() / ".cache" / "rdoc-sync" / "staging")
    p_from.add_argument("--report", type=Path, default=Path("./rdoc-from-dropbox-report.md"))
    p_from.add_argument("--dry-run", action="store_true")
    p_from.add_argument("--env", type=Path, default=Path(".env"))
```

And add a dispatch branch in `main` BEFORE the existing `sync`/`backfill` root-resolution logic (right after `args = parser.parse_args(argv)`):

```python
    if args.cmd == "from-dropbox":
        settings = load_settings(env_path=args.env if args.env.exists() else None)
        client = None if args.dry_run else build_client(settings)
        result = from_dropbox(remote=settings.dropbox_remote, staging=args.staging,
                              client=client, report_path=args.report, dry_run=args.dry_run,
                              rclone_runner=subprocess.run, run_sync_fn=run_sync)
        print(f"runs={result['n_runs']} flagged={result['n_flagged']} "
              f"failures={result['failures']} staging={result['staging']}")
        print(f"report: {args.report}")
        return 1 if result["failures"] else 0
```

(Leave the existing `sync`/`backfill` handling below unchanged.)

- [ ] **Step 5: Run the cli test + full suite + smoke**

Run: `cd rdoc_sync && uv run pytest -q`
Expected: all PASS (the new from_dropbox test included).
Run: `cd rdoc_sync && uv run python -c "from rdoc_sync import cli; print('ok')"`
Expected: `ok`.

- [ ] **Step 6: Commit**

```bash
git add rdoc_sync/src/rdoc_sync/cli.py rdoc_sync/tests/test_cli.py
git commit -m "feat(rdoc_sync): from-dropbox command (rclone pull + Supabase-only upsert)"
```

---

## Task 3: launchd plist + README

**Files:** Create `rdoc_sync/launchd/com.poldracklab.rdoc-sync.plist`; Modify `rdoc_sync/README.md`

- [ ] **Step 1: Create the LaunchAgent plist**

Create `rdoc_sync/launchd/com.poldracklab.rdoc-sync.plist` (paths are for this machine; the README documents adjusting them):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.poldracklab.rdoc-sync</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/uv</string>
        <string>run</string>
        <string>rdoc-sync</string>
        <string>from-dropbox</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/Users/lobennett/grants/r01_rdoc/projects/rdoc-fmri-experiments/rdoc_sync</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
    </dict>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>3</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    <key>StandardOutPath</key>
    <string>/Users/lobennett/Library/Logs/rdoc-sync.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/lobennett/Library/Logs/rdoc-sync.log</string>
    <key>RunAtLoad</key>
    <false/>
</dict>
</plist>
```

- [ ] **Step 2: Validate the plist is well-formed**

Run: `plutil -lint rdoc_sync/launchd/com.poldracklab.rdoc-sync.plist`
Expected: `... OK`.

- [ ] **Step 3: Add a "Recurring sync" section to `rdoc_sync/README.md`**

Append a section covering:
1. **`from-dropbox`** — `uv run rdoc-sync from-dropbox` rclone-pulls the Dropbox `raw/` tree into a persistent staging dir (`~/.cache/rdoc-sync/staging` by default; `--staging` to override) and upserts to Supabase only (idempotent; incremental pull). Flags: `--staging`, `--report`, `--dry-run`.
2. **Nightly schedule (launchd, macOS)** —
   - Install: `cp rdoc_sync/launchd/com.poldracklab.rdoc-sync.plist ~/Library/LaunchAgents/ && launchctl load ~/Library/LaunchAgents/com.poldracklab.rdoc-sync.plist`
   - It runs `rdoc-sync from-dropbox` nightly at 03:00, logging to `~/Library/Logs/rdoc-sync.log`.
   - Uninstall: `launchctl unload ~/Library/LaunchAgents/com.poldracklab.rdoc-sync.plist`
   - On another machine, edit `WorkingDirectory` (to that machine's `rdoc_sync` path) and the `uv` path in `ProgramArguments` before installing.
   - Runs only when the Mac is awake; launchd runs a missed job at next wake.
3. **Note** — the metadata column is `n_records` (count of jsPsych objects in `trialdata` — every logged screen, not only experimental trials); `migrations/001_rename_n_trials_to_n_records.sql` records the rename.

- [ ] **Step 4: Commit**

```bash
git add rdoc_sync/launchd/com.poldracklab.rdoc-sync.plist rdoc_sync/README.md
git commit -m "feat(rdoc_sync): nightly launchd agent + recurring-sync docs"
```

---

## Task 4: Live verification + install + merge (USER-GATED)

**Files:** none.

Confirm with the user before steps touching the real DB, `~/Library/LaunchAgents`, or origin.

- [ ] **Step 1: Full unit suite**

Run: `cd rdoc_sync && uv run pytest -q`
Expected: all PASS (no network).

- [ ] **Step 2: Real `from-dropbox` run (validates rename against the migrated table)**

Run: `cd rdoc_sync && uv run rdoc-sync from-dropbox --report /tmp/rdoc-from-dropbox-report.md`
Expected: pulls `raw/` (incremental) and upserts to Supabase with no column error (confirms the code now matches the renamed `n_records` column). Re-run → row count unchanged (idempotent). Spot-check a row has `n_records` populated.

- [ ] **Step 3: Install the launchd agent (USER)**

```bash
cp rdoc_sync/launchd/com.poldracklab.rdoc-sync.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.poldracklab.rdoc-sync.plist
```
Verify it's loaded: `launchctl list | grep rdoc-sync`. (Optionally trigger once now: `launchctl start com.poldracklab.rdoc-sync` and check `~/Library/Logs/rdoc-sync.log`.)

- [ ] **Step 4: Merge + push (USER-CONFIRMED)**

Merge `nf-recurring-sync` into `main` and push.

---

## Self-review notes

- **Spec coverage:** rename across code+sql+tests+migration (Task 1), `from-dropbox` core + subcommand + tests (Task 2), launchd plist + README (Task 3), live run + agent install + merge (Task 4). All spec deliverables mapped.
- **Placeholder scan:** every code/edit step gives exact content; the stray-reference grep guards the rename; the plist is concrete + plutil-validated.
- **Type/name consistency:** `n_records` used uniformly (parse field, payload key, sql column, tests). `from_dropbox(*, remote, staging, client, report_path, dry_run, rclone_runner, run_sync_fn)` matches its test; it calls `run_sync_fn` with the exact `run_sync` keyword signature (`root, client, remote, runner, hostname, exp_git_sha, report_path, dry_run, skip_dropbox`).
- **No network in tests:** `from_dropbox` injects `rclone_runner` + `run_sync_fn`; the real subcommand wiring (rclone/build_client) is exercised only in the user-gated Task 4.
