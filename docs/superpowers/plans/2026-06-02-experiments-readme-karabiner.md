# Experiments README + Karabiner Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update `rdoc-fmri-experiments` docs to the current tooling: commit the Karabiner button-box config with setup instructions, and rewrite the README around the `rdoc-launch` + `rdoc-sync` workflow.

**Architecture:** Documentation only. Commit a verbatim copy of the working Karabiner config plus a `karabiner/README.md`, then rewrite the top-level `README.md`. Verification is by JSON validity + content checks, not unit tests.

**Tech Stack:** Markdown, a static `karabiner.json` (Karabiner-Elements config). Python only for a one-off JSON validity assertion.

**Working branch:** `nf-experiments-docs` (already created off `main`; the spec is committed there).

**Repo root:** `/Users/lobennett/grants/r01_rdoc/projects/rdoc-fmri-experiments`. `export PATH="/opt/homebrew/bin:$PATH"` for uv if needed.

---

## File structure

```
rdoc-fmri-experiments/
  README.md                 # REWRITE
  karabiner/
    karabiner.json          # CREATE (copied verbatim from ~/.config/karabiner/karabiner.json)
    README.md               # CREATE (button-box setup + usage)
```

---

## Task 1: Karabiner config + setup doc

**Files:**
- Create: `karabiner/karabiner.json`
- Create: `karabiner/README.md`

- [ ] **Step 1: Copy the working config into the repo**

```bash
mkdir -p karabiner
cp ~/.config/karabiner/karabiner.json karabiner/karabiner.json
```

- [ ] **Step 2: Verify it is valid JSON with the expected profiles, device, and mappings**

Run:
```bash
python3 - <<'PY'
import json
d = json.load(open("karabiner/karabiner.json"))
profiles = {p["name"]: p for p in d["profiles"]}
assert set(profiles) >= {"span", "non-span"}, profiles.keys()
def mods(name):
    dev = profiles[name]["devices"][0]
    assert dev["identifiers"]["vendor_id"] == 6171 and dev["identifiers"]["product_id"] == 6, dev["identifiers"]
    return {m["from"]["key_code"]: m["to"][0]["key_code"] for m in dev["simple_modifications"]}
assert mods("span") == {"1": "right_arrow", "2": "down_arrow", "3": "left_arrow", "4": "up_arrow", "5": "spacebar"}, mods("span")
assert mods("non-span") == {"1": "b", "2": "y", "3": "g", "4": "r", "5": "e"}, mods("non-span")
print("OK: span + non-span profiles verified for device 6171/6")
PY
```
Expected: `OK: span + non-span profiles verified for device 6171/6`. If the assertion fails, STOP — the live config differs from the spec; report rather than editing the JSON by hand.

- [ ] **Step 3: Write `karabiner/README.md`**

Create `karabiner/README.md` with these sections (use the verified facts above; do not invent key codes):

1. **Title + purpose** — Karabiner-Elements profiles that remap the response button box (device vendor `6171` / product `6`) for the RDoC fMRI tasks. The remaps apply only to that device, not the Mac's built-in keyboard.
2. **Install** —
   - Install Karabiner-Elements (macOS): https://karabiner-elements.pqrs.org/
   - Back up any existing config: `cp ~/.config/karabiner/karabiner.json ~/.config/karabiner/karabiner.json.bak` (if present).
   - Copy this repo's config into place: `cp karabiner/karabiner.json ~/.config/karabiner/karabiner.json`.
   - Restart Karabiner-Elements so it loads the profiles.
3. **Profiles & mappings** — a table:
   - `span`: `1→right_arrow`, `2→down_arrow`, `3→left_arrow`, `4→up_arrow`, `5→spacebar`
   - `non-span`: `1→b`, `2→y`, `3→g`, `4→r`, `5→e`
4. **Usage rule** — switch the active profile in the Karabiner-Elements menu-bar icon → Profiles. Use **`span`** for `operation_span`, `operation_only_span`, and `simple_span`; use **`non-span`** for every other task. Switch per task.
5. **Note** — if the box isn't remapping, confirm Karabiner-Elements sees device vendor `6171` / product `6` (Karabiner-EventViewer shows the device IDs).

- [ ] **Step 4: Commit**

```bash
git add karabiner/karabiner.json karabiner/README.md
git commit -m "docs: commit Karabiner button-box config + setup (span/non-span profiles)"
```

---

## Task 2: Rewrite the top-level README

**Files:**
- Modify (rewrite): `README.md`

- [ ] **Step 1: Rewrite `README.md`**

Replace the entire contents with the current workflow. Include these sections in order (cross-link the package READMEs instead of duplicating flag-level detail):

1. **Title + overview** — `# rdoc-fmri-experiments`; the repo holds the RDoC fMRI task batteries plus the launcher (`rdoc_launch`) and data-sync (`rdoc_sync`) tooling.
2. **Components** —
   - `expfactory_deploy_local` — the local jsPsych battery server; install editable from the [`expfactory-deploy`](https://github.com/lobennett/expfactory-deploy) repo (`uv pip install -e /path/to/expfactory-deploy/expfactory_deploy_local`).
   - `rdoc_launch/` — the session launcher (replaces `setup.py`/`run.sh`); see [`rdoc_launch/README.md`](./rdoc_launch/README.md).
   - `rdoc_sync/` — pushes runs to Supabase + Dropbox; see [`rdoc_sync/README.md`](./rdoc_sync/README.md).
3. **One-time setup** —
   - Install [uv](https://docs.astral.sh/uv/).
   - Install `expfactory_deploy_local` editable (command above).
   - `cd rdoc_launch && uv sync`; `cd rdoc_sync && uv sync`.
   - Configure `rdoc_sync`: copy `.env.example`→`.env` and fill Supabase creds; ensure rclone is configured (see `rdoc_sync/README.md`).
   - Place `credentials.json` (Google service account) at the repo root for sheet access (gitignored).
   - Set up the response button box: see [`karabiner/README.md`](./karabiner/README.md).
4. **Run a session** (happy path, numbered):
   1. When the counterbalancing sheet changed: `cd rdoc_launch && uv run rdoc-launch update-counterbalancing`, then commit the updated `counterbalancing.json`.
   2. Set the Karabiner profile for the task type (span vs non-span).
   3. `uv run rdoc-launch launch --subject sNN --session <menu value>` (or run with no flags for interactive prompts). One Chrome window opens; the battery auto-advances; press Enter when the session is complete to trigger sync.
   4. Restart the current task = refresh the browser (partial data never saves); rerun a subset = `--tasks task1,task2`.
   5. On completion the launcher runs `rdoc-sync` automatically (push to Supabase + Dropbox); pass `--no-sync` to skip.
5. **Designs** — keep the existing links: Jeanette's [`efficiency_model_mockups`](https://github.com/jmumford/efficiency_model_mockups) repo and the [slidedeck](https://docs.google.com/presentation/d/15qc8DHQ_8VCVIX6gASrjQIuLV7KIRNbVxNnqPzLIUC8/edit?usp=sharing).
6. **Legacy** — `setup.py` and `run.sh` are retained as a fallback and will be retired once `rdoc-launch` is verified in a live session.

- [ ] **Step 2: Verify referenced paths exist**

Run:
```bash
for f in rdoc_launch/README.md rdoc_sync/README.md karabiner/README.md rdoc_sync/.env.example; do
  test -e "$f" && echo "OK $f" || echo "MISSING $f"
done
```
Expected: all `OK`. (If `rdoc_sync/.env.example` is `MISSING`, the README should reference `.env.example` at the repo root instead — check `ls .env.example` and adjust the link accordingly.)

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README for rdoc-launch + rdoc-sync workflow"
```

---

## Task 3: Merge (USER-CONFIRMED)

**Files:** none.

- [ ] **Step 1: Confirm the branch diff is docs-only**

Run: `git diff --stat main..nf-experiments-docs`
Expected: only `README.md`, `karabiner/karabiner.json`, `karabiner/README.md`, and the `docs/superpowers/specs|plans` files.

- [ ] **Step 2: Merge + push (after user confirms)**

```bash
git checkout main
git merge --no-ff nf-experiments-docs -m "Merge: experiments README + Karabiner button-box docs"
git push origin main
```

---

## Self-review notes

- **Spec coverage:** Karabiner config committed + verified (Task 1 Steps 1–2), `karabiner/README.md` with install/device/mappings/usage rule (Task 1 Step 3), README rewrite with components/setup/run-a-session/designs/legacy (Task 2), link verification (Task 2 Step 2), merge (Task 3). All spec sections mapped.
- **Placeholder scan:** the Karabiner mappings and usage rule are spelled out concretely; the JSON check asserts exact values; README sections enumerate the actual commands and links. No TBDs.
- **Accuracy guard:** the config is copied from the live file and asserted (not hand-transcribed); README links are existence-checked before commit; the `.env.example` location has an explicit fallback check.
- **Consistency:** profile names (`span`/`non-span`), device IDs (`6171`/`6`), and the span-task list (`operation_span`, `operation_only_span`, `simple_span`) match the spec throughout.
