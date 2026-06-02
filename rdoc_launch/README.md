# rdoc-launch

`rdoc-launch` replaces the old `setup.py`/`run.sh` scripts for running RDoC fMRI session batteries. It sources counterbalancing from a committed local `counterbalancing.json`, prevents bad subject/session input by construction, runs a session's battery in counterbalanced order in one auto-advancing Chrome window (launched with `--disable-background-timer-throttling`, which is critical for stimulus timing), supports single-task and subset reruns, and auto-runs `rdoc-sync` at session end.

---

## Install

Requires Python ≥ 3.11.

```bash
cd rdoc_launch
uv sync
```

---

## Refresh counterbalancing

> Requires `credentials.json` at the repo root and a network connection.

```bash
uv run rdoc-launch update-counterbalancing
```

This reads the Google Sheet `r01_rdoc_participant_tracking`, worksheet `counterbalancing`, and writes `counterbalancing.json` at the repo root. **Commit `counterbalancing.json` after each update.** Re-run whenever the sheet changes.

---

## Launch a session

**Interactive** (prompts for subject and session from menus):

```bash
uv run rdoc-launch launch
```

**Non-interactive**:

```bash
uv run rdoc-launch launch --subject s11 --session prescan3
```

### Subject validation

The subject must be in canonical `sNN` form and present in `counterbalancing.json`. Typo'd or unrecognized subjects are rejected before anything launches.

### Session values

| Value | Type |
|---|---|
| `1`–`10` | Real scan |
| `prescan1`–`prescan10` | Practice |
| `pretouch` | Practice |
| `00` | Anatomical (practice) |
| `1makeup`–`10makeup` | Real scan makeup |
| `prescan1makeup`–`prescan10makeup` | Practice makeup |

The mapping to the correct counterbalancing column and practice/real flag is handled automatically.

### What happens on launch

1. One `expfactory_deploy_local` server is started.
2. One Chrome window opens and the battery auto-advances through tasks in counterbalanced order.
3. Each task waits for its own scanner trigger before starting.
4. The launcher prints:

   ```
   Press Enter when the session is complete...
   ```

   Press **Enter** after the battery finishes to trigger end-of-session sync.

> **Note:** pressing Ctrl-C or sending EOF instead of Enter is treated as an abort; sync is skipped so partial sessions are not pushed.

---

## Restart / rerun

| Situation | Action |
|---|---|
| Restart the current task | Refresh the browser. Partial task data is never saved — a task only writes on completion. |
| Restart the whole battery | Open the `/reset` URL on the server (e.g. `http://localhost:<port>/reset`). |
| Rerun a subset of tasks | Pass `--tasks` with a comma-separated list of task-name substrings (see below). |

**Subset rerun example** — reruns only tasks whose names contain `stroop` or `flanker`:

```bash
uv run rdoc-launch launch --subject s11 --session prescan3 --tasks stroop,flanker
```

---

## Session-end sync

On normal completion the launcher automatically runs:

```bash
uv run rdoc-sync sync
```

This pushes data to Supabase and Dropbox. Failures are reported to stderr but are non-fatal; data is saved locally and sync can be re-run manually later.

To skip sync entirely:

```bash
uv run rdoc-launch launch --subject s11 --session 3 --no-sync
```

---

## Notes

- The battery config is written to `.rdoc-launch-battery.txt` at the repo root (gitignored).
- Experiments are served in the counterbalanced order drawn from `counterbalancing.json`.
- `credentials.json` and `.env` are gitignored and must never be committed.
