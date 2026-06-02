# Design: RDoC session launcher (`rdoc-launch`)

**Date:** 2026-06-02
**Status:** Approved (brainstorming)
**Repo:** `rdoc-fmri-experiments`
**Scope:** Project C of a 4-project decomposition (A: module cleanup — DONE; B: rdoc-sync — DONE; C: this; D: experiments README + Karabiner).

## Goal

Replace the ~450-line `setup.py` and `run.sh` with a clean, testable launcher (`rdoc-launch`) that: sources counterbalancing from a committed local file (no live Google Sheets at launch), prevents bad subject/session input by construction, runs a session's battery in counterbalanced order in one auto-advancing Chrome window, supports easy restart/rerun, and auto-syncs at session end via `rdoc-sync`.

## Background / current state

- `setup.py` reads the Google Sheet `r01_rdoc_participant_tracking` / worksheet `counterbalancing` live on every launch (via `gspread` + a gitignored service-account `credentials.json`), prompts for subject/session with branching logic (anatomical/pretouch/prescan/regular), maps abbreviated task names to full experiment dirs, then spawns a Terminal window + a throttling-disabled Chrome per task and juggles ports from 5000/8080. It hardcodes `-run 1`.
- The `expfactory_deploy_local` module already serves a multi-experiment battery from one server, advancing to the next task on each POST (serving/popping from the **end** of the experiment list) until done. The `--disable-background-timer-throttling` Chrome flag was found critical for stimulus timing.
- Project B (`rdoc-sync`) provides an idempotent `rdoc-sync sync` that pushes `.output` runs to Supabase + Dropbox; B deferred the session-end auto-invoke to C.
- The corpus audit showed subject/session naming inconsistencies (`sub-11`, mislabeled sessions) that originate at launch time and that a multi-machine manual workflow keeps reintroducing.

## Architecture

A new uv package **`rdoc_launch/`** in this repo (sibling to `rdoc_sync/`), CLI **`rdoc-launch`**. Pure logic (mapping, validation, battery resolution) lives in focused, unit-tested modules; all side effects (Google Sheets export, the local web server, Chrome, the `rdoc-sync` call) go through thin, injectable wrappers so tests run with no network/GUI.

Proposed layout:
```
rdoc-fmri-experiments/
  counterbalancing.json        # CREATE (committed): exported counterbalancing
  rdoc_launch/
    pyproject.toml
    src/rdoc_launch/
      cli.py            # `rdoc-launch` entry: launch (default) + update-counterbalancing
      config.py         # paths/constants (output dirs, credentials path, sheet/worksheet names)
      counterbalancing.py # load counterbalancing.json; resolve a subject+session -> ordered battery
      sessions.py       # session vocabulary + session -> (cb_column, is_practice, label) mapping
      tasks.py          # abbreviated -> full task name mapping; task -> experiment dir name
      validate.py       # subject/session constrained selection + validation
      battery.py        # write the (reverse-ordered) battery config file
      runner.py         # start expfactory_deploy_local server, detect port, open Chrome (throttle flag)
      export.py         # update-counterbalancing: gspread sheet -> counterbalancing.json
    tests/
  setup.py, run.sh               # DELETE once rdoc-launch is proven (Task at end of plan)
```

## counterbalancing.json (committed)

Exported from the sheet, keyed by subject → session column → ordered task array (each item `[abbrev_task, run, practice_flag]`, mirroring the sheet cells):
```json
{
  "s11": {
    "ses-01": [["stroop", 1, false], ["flanker", 1, false], "..."],
    "ses-02": ["..."]
  }
}
```
Version-controlled → every run is reproducible and diffs are reviewable. `update-counterbalancing` regenerates it from the sheet.

## Session vocabulary & mapping

The launcher offers a fixed session menu and maps each to (a) which counterbalancing column supplies the task order, (b) whether to use practice task versions, and (c) the output session label written to `-ses`:

| Menu session | CB column | Task versions | Output label (`-ses`) |
|---|---|---|---|
| `N` (1–10) | `ses-NN` | real (`_rdoc__fmri`) | `N` |
| `prescanN` (1–10) | `ses-NN` | practice (`_rdoc_practice__fmri`) | `prescanN` |
| `pretouch` | `ses-01` | practice | `pretouch` |
| `00` (anatomical) | `ses-02` | practice | `00` |
| `Nmakeup` | `ses-NN` | real | `Nmakeup` |
| `prescanNmakeup` | `ses-NN` | practice | `prescanNmakeup` |

(Carried over from `setup.py`; the makeup rows are new and confirmed: makeup uses the base session's column, `Nmakeup`=real, `prescanNmakeup`=practice.) `pretouch1` is **not** a menu option — the legacy `pretouch1` rows are a separate data-hygiene item.

Task-name mapping (from `setup.py`): `spatialTS→spatial_task_switching`, `cuedTS→cued_task_switching`, `visualSearch→visual_search`, `simpleSpan→simple_span`, `opOnlySpan→operation_only_span`, `opSpan→operation_span`, `flanker→flanker`, `goNogo→go_nogo`, `axCPT→ax_cpt`, `spatialCueing→spatial_cueing`, `stroop→stroop`, `nBack→n_back`, `stopSignal→stop_signal`. Each resolves to an experiment dir `<full>_rdoc[_practice]__fmri`.

## Constrained selection (validation by construction)

- **Subject:** selected from / validated against `counterbalancing.json` keys — must be canonical `sNN` and present. Bad/typo'd ids (e.g. `11`, `sub-11`) cannot be entered.
- **Session:** selected from the fixed menu above. Free-text session typos are impossible.

If a chosen subject+session has no counterbalancing entry, the launcher errors clearly and does not launch.

## Launch model

1. Resolve the ordered battery: look up `counterbalancing.json[subject][cb_column]`, map each task to its experiment dir (practice/real per the session), preserving counterbalanced order.
2. Write the battery to a config file. **Because the module serves/pops from the end of the list, the battery file is written in reverse counterbalanced order** so tasks run in the intended order.
3. Start **one** `expfactory_deploy_local` server: `expfactory_deploy_local -c <battery> -raw .output/raw -bids .output/bids -sub <subject> -ses <label> -run 1`. Detect the actual bound port from the server's startup output (it scans from 8080).
4. Open **one** Chrome window at `http://localhost:<port>` with `--disable-background-timer-throttling --new-window`.
5. The battery auto-advances through tasks as each completes; each task waits for its own scanner trigger to begin.

## Restart / rerun

- **Refresh** the browser → restarts the current task; partial data never saves (POST only at completion).
- **`/reset`** route → restarts the whole battery (clears the session).
- **`rdoc-launch launch --tasks <names>`** (or an interactive multi-select of the resolved battery) → (re)run one task or a subset through the same single-window mechanism, for redoing an already-completed task.

## Session-end sync

When the battery finishes, the launcher **auto-runs `rdoc-sync sync --output .output`**. Failures are reported but **non-fatal** (local files are already written; sync is idempotent and re-runnable). This wires up the hook Project B deferred.

## Error handling

- Validation makes bad subject/session input impossible; a missing counterbalancing entry errors before any launch.
- Server/Chrome launch failures are surfaced clearly; the launcher does not delete or modify collected data.
- `rdoc-sync` invocation is wrapped so a sync failure prints guidance but does not fail the session.
- `update-counterbalancing` validates it can open the sheet/worksheet and writes `counterbalancing.json` atomically.

## Testing

pytest, no network/GUI (all side effects injected/mocked):
- `sessions` — every menu session maps to the right column/practice/label, incl. makeup variants; unknown session rejected.
- `tasks` — abbreviation→full and task→experiment-dir resolution (practice vs real).
- `validate` — accepts canonical `sNN` present in the data; rejects `11`/`sub-11`/typos and absent subjects; rejects off-menu sessions.
- `counterbalancing` + `battery` — parse `counterbalancing.json`, resolve a subject+session to the ordered battery, and assert the battery file is written in reverse so serving order matches counterbalancing.
- `runner` — with an injected subprocess runner: asserts the `expfactory_deploy_local` command (flags, `-sub/-ses/-run`), port detection from sample server output, and the Chrome command includes the throttle flag.
- `cli` — end-to-end `launch` with fakes: validation → battery resolution → server/Chrome invocation → session-end `rdoc-sync` call (non-fatal on failure).
- `export` (gspread) is network — thin, untested (documented manual check).

## Non-goals / relationships

- No changes to `expfactory_deploy_local` (Project A) or `rdoc_sync` internals (Project B; only invoked).
- Reconciling legacy `pretouch1` rows and re-cleaning Dropbox are separate data-hygiene follow-ups.
- `setup.py` and `run.sh` are removed once `rdoc-launch` is verified in a real session.

## Validation criteria

- `rdoc-launch update-counterbalancing` produces a `counterbalancing.json` matching the sheet.
- `rdoc-launch launch` for a valid subject+session launches one server + one throttle-flagged Chrome, serves the battery in counterbalanced order, and on completion runs `rdoc-sync sync`.
- Entering a non-existent subject or an off-menu session is impossible / errors before launch.
- `--tasks <subset>` reruns the chosen task(s) only.
- `pytest` passes with no network or GUI.
