# Design: experiments README + Karabiner button-box docs

**Date:** 2026-06-02
**Status:** Approved (brainstorming)
**Repo:** `rdoc-fmri-experiments`
**Scope:** Project D of a 4-project decomposition (A: module cleanup — DONE; B: rdoc-sync — DONE; C: rdoc-launch — DONE; D: this).

## Goal

Bring the `rdoc-fmri-experiments` documentation up to date with the new tooling and hardware setup: rewrite the outdated `README.md` around the `rdoc-launch` + `rdoc-sync` workflow, and add the Karabiner button-box configuration plus setup instructions. Documentation only — no code changes beyond committing the Karabiner config file.

## Background / current state

- The current `README.md` is outdated: it describes installing a fork of `expfactory-deploy` and running tasks via `run.sh`, with a confusing clone/venv flow. It predates Projects B and C and does not mention `rdoc_launch` or `rdoc_sync`.
- The repo now contains two uv packages: `rdoc_launch/` (session launcher, replacing `setup.py`/`run.sh`) and `rdoc_sync/` (Supabase + Dropbox sync). `setup.py`/`run.sh` are retained as fallback until `rdoc-launch` is verified live.
- The button-box remapping lives only at `~/.config/karabiner/karabiner.json` (not in the repo). It has two profiles for device vendor `6171` / product `6`:
  - `span`: `1→right_arrow`, `2→down_arrow`, `3→left_arrow`, `4→up_arrow`, `5→spacebar`
  - `non-span`: `1→b`, `2→y`, `3→g`, `4→r`, `5→e`
- Usage rule (confirmed): use the `span` profile for the span tasks (`operation_span`, `operation_only_span`, `simple_span`); use `non-span` for every other task; switch per task.

## Deliverable 1: Karabiner config + docs (new `karabiner/` directory)

- **`karabiner/karabiner.json`** — a committed copy of the working config. The live config contains only the two profiles (no machine-specific secrets), so it is committed verbatim.
- **`karabiner/README.md`** covering:
  1. Install Karabiner-Elements (macOS).
  2. Copy `karabiner/karabiner.json` → `~/.config/karabiner/karabiner.json` (back up any existing one first), then restart Karabiner-Elements so it picks up the profiles.
  3. The target device: vendor `6171` / product `6` — the remaps apply only to that button box, not the Mac keyboard.
  4. The two profiles and their full mappings (span: 1–4→arrows, 5→spacebar; non-span: 1–5→b,y,g,r,e).
  5. Usage rule: select `span` (Karabiner-Elements menu bar → Profiles) for `operation_span`, `operation_only_span`, `simple_span`; use `non-span` for all other tasks; switch per task.

## Deliverable 2: README rewrite (`rdoc-fmri-experiments/README.md`)

Replace the fork/`run.sh` content with the current workflow:

- **Overview** — the repo holds the RDoC fMRI task batteries plus the launcher (`rdoc_launch`) and data-sync (`rdoc_sync`) tooling.
- **Components** — three pieces and how they relate:
  - `expfactory_deploy_local` — the local jsPsych battery server, installed editable from the `expfactory-deploy` repo (its `main` now carries the cleaned module).
  - `rdoc_launch` — the session launcher (replaces `setup.py`/`run.sh`); see `rdoc_launch/README.md`.
  - `rdoc_sync` — pushes runs to Supabase + Dropbox; see `rdoc_sync/README.md`.
- **One-time setup** — install uv; install `expfactory_deploy_local` editable; `uv sync` the `rdoc_launch` and `rdoc_sync` packages; configure `rdoc_sync`'s `.env` (Supabase) and rclone (Dropbox); place `credentials.json` for sheet access; set up the Karabiner button box (link to `karabiner/README.md`).
- **Run a session** (happy path):
  1. `cd rdoc_launch && uv run rdoc-launch update-counterbalancing` when the sheet changed; commit `counterbalancing.json`.
  2. Set the Karabiner profile for the task type (span vs non-span).
  3. `uv run rdoc-launch launch --subject sNN --session <menu value>` (or interactive) → one Chrome window, battery auto-advances; press Enter at session end → auto `rdoc-sync`.
  4. Restart the current task = refresh the browser; rerun a subset = `--tasks`.
- **Designs** — keep the existing links to Jeanette's `efficiency_model_mockups` repo and the slidedeck.
- **Legacy note** — `setup.py`/`run.sh` are retained as fallback and will be retired once `rdoc-launch` is verified in a live session.

Cross-link the two package READMEs rather than duplicating their detail.

## Error handling / edge cases

- The README directs the reader to the package READMEs for flag-level detail (single source of truth).
- The Karabiner doc notes backing up any existing `~/.config/karabiner/karabiner.json` before overwriting, since a user may have unrelated profiles.

## Testing

No automated tests (documentation + a static config file). Verification is manual: the committed `karabiner/karabiner.json` is valid JSON and byte-matches the working profiles; the README links resolve to real paths/files in the repo.

## Non-goals

- No code changes to any package.
- No new tooling, no changes to the launch/sync behavior.
- Reconciling legacy data labels (e.g. `pretouch1`) and re-cleaning Dropbox remain separate follow-ups.

## Validation criteria

- `README.md` describes the `update-counterbalancing → launch → auto-sync` workflow and links to the `rdoc_launch`, `rdoc_sync`, and `karabiner` READMEs; no remaining references to `run.sh` as the primary launch path.
- `karabiner/karabiner.json` is valid JSON containing the `span` and `non-span` profiles for device `6171`/`6`, matching the live config.
- `karabiner/README.md` documents install, placement, the device, both mappings, and the per-task usage rule.
