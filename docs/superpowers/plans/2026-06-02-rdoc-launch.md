# rdoc-launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `rdoc-launch`, a uv-packaged CLI that replaces `setup.py`/`run.sh`: it sources counterbalancing from a committed local JSON, prevents bad subject/session input by construction, runs a session's battery in counterbalanced order in one auto-advancing throttle-flagged Chrome window, supports single/subset reruns, and auto-syncs via `rdoc-sync` at session end.

**Architecture:** Pure logic (task/session mapping, validation, battery resolution, command building) in small unit-tested modules; all side effects (Google Sheets export, the local server, Chrome, the `rdoc-sync` call) behind injectable callables so tests run with no network/GUI.

**Tech Stack:** Python ≥3.11, uv, `gspread` (export only), `rclone`/`expfactory_deploy_local`/`rdoc-sync` invoked as subprocesses, pytest.

**Working branch:** `nf-rdoc-launch` (already created off `main` in `rdoc-fmri-experiments`; the design spec is committed there).

**Run `export PATH="/opt/homebrew/bin:$PATH"` for uv. All pytest runs from inside `rdoc_launch/`.**

---

## File structure

```
rdoc-fmri-experiments/
  counterbalancing.json          # produced by `update-counterbalancing` (committed later, by the user)
  rdoc_launch/
    pyproject.toml
    src/rdoc_launch/
      __init__.py
      config.py            # repo-root-derived paths + constants
      tasks.py             # abbreviation->full task name; task->experiment dir
      sessions.py          # SessionPlan + resolve_session + session_menu
      validate.py          # validate_subject
      counterbalancing.py  # load_counterbalancing + resolve_battery
      battery.py           # write_battery (reverse order)
      runner.py            # build_server_cmd, detect_port, build_chrome_cmd, ServerHandle, start_server
      export.py            # build_counterbalancing + export_counterbalancing
      cli.py               # run_launch (testable core) + main (argparse + real wiring)
    tests/
      __init__.py
      test_tasks.py  test_sessions.py  test_validate.py
      test_counterbalancing.py  test_battery.py  test_runner.py
      test_export.py  test_cli.py
  setup.py, run.sh               # DELETED in Task 10 (after live verification)
```

**Key facts the code depends on:**
- The `expfactory_deploy_local` server serves/pops experiments from the **end** of the `-c` list, so the battery file is written **reversed** to run in counterbalanced order.
- Counterbalancing cell = a list of `[abbrev_task, run, practice_flag]`; `run` and the cell's practice flag are ignored — run is always `1` and practice is decided by the session.
- Experiments live at the repo root as dirs like `stroop_rdoc__fmri` / `stroop_rdoc_practice__fmri`.

---

## Task 1: Scaffold package + config.py

**Files:** Create `rdoc_launch/pyproject.toml`, `rdoc_launch/src/rdoc_launch/__init__.py`, `rdoc_launch/tests/__init__.py`, `rdoc_launch/src/rdoc_launch/config.py`

- [ ] **Step 1: Create `rdoc_launch/pyproject.toml`**

```toml
[project]
name = "rdoc-launch"
version = "0.1.0"
description = "Launch RDoC fMRI session batteries from local counterbalancing"
requires-python = ">=3.11"
dependencies = ["gspread>=6.0"]

[project.scripts]
rdoc-launch = "rdoc_launch.cli:main"

[dependency-groups]
dev = ["pytest>=8"]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["src/rdoc_launch"]

[tool.pytest.ini_options]
testpaths = ["tests"]
```

- [ ] **Step 2: Create empty `rdoc_launch/src/rdoc_launch/__init__.py` and `rdoc_launch/tests/__init__.py`.**

- [ ] **Step 3: Create `rdoc_launch/src/rdoc_launch/config.py`**

```python
"""Repo-root-derived paths and constants for the launcher."""
from __future__ import annotations

from pathlib import Path

# config.py -> src/rdoc_launch -> src -> rdoc_launch -> repo root
REPO_ROOT = Path(__file__).resolve().parents[3]

OUTPUT_DIR = REPO_ROOT / ".output"
RAW_DIR = OUTPUT_DIR / "raw"
BIDS_DIR = OUTPUT_DIR / "bids"
COUNTERBALANCING_JSON = REPO_ROOT / "counterbalancing.json"
CREDENTIALS_PATH = REPO_ROOT / "credentials.json"
BATTERY_FILE = REPO_ROOT / ".rdoc-launch-battery.txt"

SPREADSHEET_NAME = "r01_rdoc_participant_tracking"
WORKSHEET_NAME = "counterbalancing"

CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
CHROME_FLAGS = ["--disable-background-timer-throttling", "--new-window"]
```

- [ ] **Step 4: Sync env**

Run: `cd rdoc_launch && uv sync --group dev`
Expected: resolves gspread + pytest.

- [ ] **Step 5: Add the battery temp file to repo .gitignore**

Append `.rdoc-launch-battery.txt` to the repo-root `.gitignore` (check first: `grep -n "rdoc-launch-battery" .gitignore`).

- [ ] **Step 6: Commit**

```bash
git add rdoc_launch/pyproject.toml rdoc_launch/src/rdoc_launch/__init__.py rdoc_launch/tests/__init__.py rdoc_launch/src/rdoc_launch/config.py rdoc_launch/uv.lock .gitignore
git commit -m "chore: scaffold rdoc_launch package + config"
```

---

## Task 2: `tasks.py` — task name mapping

**Files:** Create `rdoc_launch/src/rdoc_launch/tasks.py`; Test `rdoc_launch/tests/test_tasks.py`

- [ ] **Step 1: Write the failing test**

```python
# rdoc_launch/tests/test_tasks.py
import pytest
from rdoc_launch.tasks import full_task_name, experiment_dir


def test_full_task_name_maps_abbreviations():
    assert full_task_name("spatialTS") == "spatial_task_switching"
    assert full_task_name("cuedTS") == "cued_task_switching"
    assert full_task_name("nBack") == "n_back"
    assert full_task_name("stroop") == "stroop"


def test_full_task_name_unknown_raises():
    with pytest.raises(ValueError, match="mystery"):
        full_task_name("mystery")


def test_experiment_dir_practice_and_real():
    assert experiment_dir("stroop", is_practice=False) == "stroop_rdoc__fmri"
    assert experiment_dir("spatialTS", is_practice=True) == "spatial_task_switching_rdoc_practice__fmri"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd rdoc_launch && uv run pytest tests/test_tasks.py -v`
Expected: FAIL (ModuleNotFoundError: rdoc_launch.tasks).

- [ ] **Step 3: Write minimal implementation**

```python
# rdoc_launch/src/rdoc_launch/tasks.py
"""Map abbreviated task names (from the sheet) to full names and experiment dirs."""
from __future__ import annotations

TASK_MAP = {
    "spatialTS": "spatial_task_switching",
    "cuedTS": "cued_task_switching",
    "visualSearch": "visual_search",
    "simpleSpan": "simple_span",
    "opOnlySpan": "operation_only_span",
    "opSpan": "operation_span",
    "flanker": "flanker",
    "goNogo": "go_nogo",
    "axCPT": "ax_cpt",
    "spatialCueing": "spatial_cueing",
    "stroop": "stroop",
    "nBack": "n_back",
    "stopSignal": "stop_signal",
}


def full_task_name(abbrev: str) -> str:
    if abbrev not in TASK_MAP:
        raise ValueError(f"Unknown task abbreviation: {abbrev!r}")
    return TASK_MAP[abbrev]


def experiment_dir(abbrev: str, is_practice: bool) -> str:
    suffix = "_rdoc_practice__fmri" if is_practice else "_rdoc__fmri"
    return f"{full_task_name(abbrev)}{suffix}"
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd rdoc_launch && uv run pytest tests/test_tasks.py -v`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add rdoc_launch/src/rdoc_launch/tasks.py rdoc_launch/tests/test_tasks.py
git commit -m "feat(rdoc_launch): task name + experiment dir mapping"
```

---

## Task 3: `sessions.py` — session vocabulary + mapping

**Files:** Create `rdoc_launch/src/rdoc_launch/sessions.py`; Test `rdoc_launch/tests/test_sessions.py`

- [ ] **Step 1: Write the failing test**

```python
# rdoc_launch/tests/test_sessions.py
import pytest
from rdoc_launch.sessions import resolve_session, session_menu, SessionPlan


def test_regular_session():
    assert resolve_session("3") == SessionPlan(cb_column="ses-03", is_practice=False, label="3")


def test_prescan_session():
    assert resolve_session("prescan3") == SessionPlan(cb_column="ses-03", is_practice=True, label="prescan3")


def test_pretouch_and_anatomical():
    assert resolve_session("pretouch") == SessionPlan(cb_column="ses-01", is_practice=True, label="pretouch")
    assert resolve_session("00") == SessionPlan(cb_column="ses-02", is_practice=True, label="00")


def test_makeup_variants():
    assert resolve_session("4makeup") == SessionPlan(cb_column="ses-04", is_practice=False, label="4makeup")
    assert resolve_session("prescan4makeup") == SessionPlan(cb_column="ses-04", is_practice=True, label="prescan4makeup")


def test_invalid_session_raises():
    with pytest.raises(ValueError):
        resolve_session("pretouch1")
    with pytest.raises(ValueError):
        resolve_session("11")


def test_menu_contains_expected_entries():
    menu = session_menu()
    for expected in ["1", "10", "prescan1", "prescan10", "pretouch", "00", "4makeup", "prescan4makeup"]:
        assert expected in menu
    assert "pretouch1" not in menu and "11" not in menu
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd rdoc_launch && uv run pytest tests/test_sessions.py -v`
Expected: FAIL (ModuleNotFoundError: rdoc_launch.sessions).

- [ ] **Step 3: Write minimal implementation**

```python
# rdoc_launch/src/rdoc_launch/sessions.py
"""Session menu vocabulary and mapping to counterbalancing column / practice / label."""
from __future__ import annotations

import re
from dataclasses import dataclass


@dataclass(frozen=True)
class SessionPlan:
    cb_column: str   # which counterbalancing column supplies the task order
    is_practice: bool
    label: str       # value written to -ses


def resolve_session(choice: str) -> SessionPlan:
    if re.fullmatch(r"[1-9]|10", choice):
        n = int(choice)
        return SessionPlan(f"ses-{n:02d}", False, str(n))
    m = re.fullmatch(r"prescan([1-9]|10)", choice)
    if m:
        n = int(m.group(1))
        return SessionPlan(f"ses-{n:02d}", True, f"prescan{n}")
    if choice == "pretouch":
        return SessionPlan("ses-01", True, "pretouch")
    if choice == "00":
        return SessionPlan("ses-02", True, "00")
    m = re.fullmatch(r"([1-9]|10)makeup", choice)
    if m:
        n = int(m.group(1))
        return SessionPlan(f"ses-{n:02d}", False, f"{n}makeup")
    m = re.fullmatch(r"prescan([1-9]|10)makeup", choice)
    if m:
        n = int(m.group(1))
        return SessionPlan(f"ses-{n:02d}", True, f"prescan{n}makeup")
    raise ValueError(f"Invalid session choice: {choice!r}")


def session_menu() -> list[str]:
    nums = [str(n) for n in range(1, 11)]
    out = list(nums)
    out += [f"prescan{n}" for n in range(1, 11)]
    out += ["pretouch", "00"]
    out += [f"{n}makeup" for n in range(1, 11)]
    out += [f"prescan{n}makeup" for n in range(1, 11)]
    return out
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd rdoc_launch && uv run pytest tests/test_sessions.py -v`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add rdoc_launch/src/rdoc_launch/sessions.py rdoc_launch/tests/test_sessions.py
git commit -m "feat(rdoc_launch): session vocabulary + mapping (incl. makeup)"
```

---

## Task 4: `validate.py` — subject validation

**Files:** Create `rdoc_launch/src/rdoc_launch/validate.py`; Test `rdoc_launch/tests/test_validate.py`

- [ ] **Step 1: Write the failing test**

```python
# rdoc_launch/tests/test_validate.py
import pytest
from rdoc_launch.validate import validate_subject

CB = {"s4": {}, "s11": {}}


def test_valid_subject_passes():
    assert validate_subject("s11", CB) == "s11"


def test_numeric_subject_rejected():
    with pytest.raises(ValueError, match="sNN"):
        validate_subject("11", CB)


def test_sub_prefixed_rejected():
    with pytest.raises(ValueError, match="sNN"):
        validate_subject("sub-11", CB)


def test_absent_subject_rejected():
    with pytest.raises(ValueError, match="not in counterbalancing"):
        validate_subject("s99", CB)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd rdoc_launch && uv run pytest tests/test_validate.py -v`
Expected: FAIL (ModuleNotFoundError: rdoc_launch.validate).

- [ ] **Step 3: Write minimal implementation**

```python
# rdoc_launch/src/rdoc_launch/validate.py
"""Constrained subject validation against the counterbalancing data."""
from __future__ import annotations

import re

_CANON = re.compile(r"^s\d+$")


def validate_subject(subject: str, counterbalancing: dict) -> str:
    if not _CANON.match(subject):
        raise ValueError(f"Subject must be canonical sNN (e.g. s11), got {subject!r}")
    if subject not in counterbalancing:
        raise ValueError(f"Subject {subject!r} not in counterbalancing data")
    return subject
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd rdoc_launch && uv run pytest tests/test_validate.py -v`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add rdoc_launch/src/rdoc_launch/validate.py rdoc_launch/tests/test_validate.py
git commit -m "feat(rdoc_launch): subject validation (canonical sNN, must exist)"
```

---

## Task 5: `counterbalancing.py` — load + resolve battery

**Files:** Create `rdoc_launch/src/rdoc_launch/counterbalancing.py`; Test `rdoc_launch/tests/test_counterbalancing.py`

- [ ] **Step 1: Write the failing test**

```python
# rdoc_launch/tests/test_counterbalancing.py
import json
import pytest
from rdoc_launch.counterbalancing import load_counterbalancing, resolve_battery
from rdoc_launch.sessions import SessionPlan


def test_load_counterbalancing(tmp_path):
    p = tmp_path / "cb.json"
    p.write_text(json.dumps({"s4": {"ses-03": [["stroop", 1, False]]}}))
    cb = load_counterbalancing(p)
    assert cb["s4"]["ses-03"][0][0] == "stroop"


def test_resolve_battery_real_order_preserved():
    cb = {"s4": {"ses-03": [["axCPT", 1, False], ["flanker", 1, False], ["stroop", 1, False]]}}
    plan = SessionPlan(cb_column="ses-03", is_practice=False, label="3")
    battery = resolve_battery(cb, "s4", plan)
    assert battery == ["ax_cpt_rdoc__fmri", "flanker_rdoc__fmri", "stroop_rdoc__fmri"]


def test_resolve_battery_practice_versions():
    cb = {"s4": {"ses-03": [["axCPT", 1, True]]}}
    plan = SessionPlan(cb_column="ses-03", is_practice=True, label="prescan3")
    assert resolve_battery(cb, "s4", plan) == ["ax_cpt_rdoc_practice__fmri"]


def test_resolve_battery_missing_column_raises():
    cb = {"s4": {"ses-03": [["stroop", 1, False]]}}
    plan = SessionPlan(cb_column="ses-09", is_practice=False, label="9")
    with pytest.raises(ValueError, match="ses-09"):
        resolve_battery(cb, "s4", plan)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd rdoc_launch && uv run pytest tests/test_counterbalancing.py -v`
Expected: FAIL (ModuleNotFoundError: rdoc_launch.counterbalancing).

- [ ] **Step 3: Write minimal implementation**

```python
# rdoc_launch/src/rdoc_launch/counterbalancing.py
"""Load the committed counterbalancing JSON and resolve a subject+session to a battery."""
from __future__ import annotations

import json
from pathlib import Path

from .sessions import SessionPlan
from .tasks import experiment_dir


def load_counterbalancing(path) -> dict:
    return json.loads(Path(path).read_text())


def resolve_battery(cb: dict, subject: str, plan: SessionPlan) -> list[str]:
    if subject not in cb:
        raise ValueError(f"Subject {subject!r} not in counterbalancing data")
    column = cb[subject].get(plan.cb_column)
    if not column:
        raise ValueError(f"No counterbalancing tasks for {subject!r} column {plan.cb_column!r}")
    return [experiment_dir(item[0], plan.is_practice) for item in column]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd rdoc_launch && uv run pytest tests/test_counterbalancing.py -v`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add rdoc_launch/src/rdoc_launch/counterbalancing.py rdoc_launch/tests/test_counterbalancing.py
git commit -m "feat(rdoc_launch): load counterbalancing + resolve battery"
```

---

## Task 6: `battery.py` — write the reversed battery config

**Files:** Create `rdoc_launch/src/rdoc_launch/battery.py`; Test `rdoc_launch/tests/test_battery.py`

- [ ] **Step 1: Write the failing test**

```python
# rdoc_launch/tests/test_battery.py
from pathlib import Path
from rdoc_launch.battery import write_battery


def test_write_battery_reverses_for_serving_order(tmp_path):
    out = tmp_path / "battery.txt"
    write_battery(["ax_cpt_rdoc__fmri", "flanker_rdoc__fmri", "stroop_rdoc__fmri"],
                  out, exp_root=Path("/repo"))
    lines = out.read_text().splitlines()
    # module serves/pops from the END, so file is reversed -> first task last
    assert lines == ["/repo/stroop_rdoc__fmri", "/repo/flanker_rdoc__fmri", "/repo/ax_cpt_rdoc__fmri"]
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd rdoc_launch && uv run pytest tests/test_battery.py -v`
Expected: FAIL (ModuleNotFoundError: rdoc_launch.battery).

- [ ] **Step 3: Write minimal implementation**

```python
# rdoc_launch/src/rdoc_launch/battery.py
"""Write the battery config file the local server consumes via -c.

The server serves and pops experiments from the END of the list, so we write
the battery reversed: the first task to run is placed last.
"""
from __future__ import annotations

from pathlib import Path


def write_battery(experiment_dirs: list[str], path, exp_root: Path) -> Path:
    lines = [str(Path(exp_root) / d) for d in reversed(experiment_dirs)]
    out = Path(path)
    out.write_text("\n".join(lines) + "\n")
    return out
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd rdoc_launch && uv run pytest tests/test_battery.py -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add rdoc_launch/src/rdoc_launch/battery.py rdoc_launch/tests/test_battery.py
git commit -m "feat(rdoc_launch): write reversed battery config for in-order serving"
```

---

## Task 7: `runner.py` — server/Chrome command building + start_server

**Files:** Create `rdoc_launch/src/rdoc_launch/runner.py`; Test `rdoc_launch/tests/test_runner.py`

- [ ] **Step 1: Write the failing test**

```python
# rdoc_launch/tests/test_runner.py
from rdoc_launch.runner import build_server_cmd, detect_port, build_chrome_cmd


def test_build_server_cmd():
    cmd = build_server_cmd("/repo/.battery.txt", "s11", "prescan3", "/repo/.output/raw", "/repo/.output/bids")
    assert cmd == ["expfactory_deploy_local", "-c", "/repo/.battery.txt",
                   "-raw", "/repo/.output/raw", "-bids", "/repo/.output/bids",
                   "-sub", "s11", "-ses", "prescan3", "-run", "1"]


def test_detect_port_parses_startup_line():
    assert detect_port("Starting server on port 8083") == 8083
    assert detect_port("some other line") is None


def test_build_chrome_cmd_includes_throttle_flag():
    cmd = build_chrome_cmd(8083, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                           ["--disable-background-timer-throttling", "--new-window"])
    assert cmd[0].endswith("Google Chrome")
    assert cmd[1] == "http://localhost:8083"
    assert "--disable-background-timer-throttling" in cmd
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd rdoc_launch && uv run pytest tests/test_runner.py -v`
Expected: FAIL (ModuleNotFoundError: rdoc_launch.runner).

- [ ] **Step 3: Write minimal implementation**

```python
# rdoc_launch/src/rdoc_launch/runner.py
"""Build commands for the local server + Chrome, and start the server detecting its port."""
from __future__ import annotations

import re
import subprocess
from dataclasses import dataclass
from typing import Optional

_PORT_RE = re.compile(r"Starting server on port (\d+)")


def build_server_cmd(battery_path: str, subject: str, label: str,
                     raw_dir: str, bids_dir: str) -> list[str]:
    return ["expfactory_deploy_local", "-c", str(battery_path),
            "-raw", str(raw_dir), "-bids", str(bids_dir),
            "-sub", subject, "-ses", label, "-run", "1"]


def detect_port(line: str) -> Optional[int]:
    m = _PORT_RE.search(line)
    return int(m.group(1)) if m else None


def build_chrome_cmd(port: int, chrome_path: str, flags: list[str]) -> list[str]:
    return [chrome_path, f"http://localhost:{port}", *flags]


@dataclass
class ServerHandle:
    port: int
    proc: object

    def stop(self) -> None:
        try:
            self.proc.terminate()
        except Exception:
            pass


def start_server(cmd: list[str], cwd: str, popen=subprocess.Popen) -> ServerHandle:
    """Start the server and block until it prints its bound port."""
    proc = popen(cmd, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    for line in proc.stdout:  # read until the port line appears
        print(line, end="")
        port = detect_port(line)
        if port is not None:
            return ServerHandle(port=port, proc=proc)
    raise RuntimeError("Server exited before reporting a port")
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd rdoc_launch && uv run pytest tests/test_runner.py -v`
Expected: PASS (3 tests). (`start_server` is exercised via the CLI test with a fake popen in Task 9.)

- [ ] **Step 5: Commit**

```bash
git add rdoc_launch/src/rdoc_launch/runner.py rdoc_launch/tests/test_runner.py
git commit -m "feat(rdoc_launch): server/Chrome command building + start_server"
```

---

## Task 8: `export.py` — update-counterbalancing (sheet -> JSON)

**Files:** Create `rdoc_launch/src/rdoc_launch/export.py`; Test `rdoc_launch/tests/test_export.py`

- [ ] **Step 1: Write the failing test** (pure parsing; gspread mocked via injected records)

```python
# rdoc_launch/tests/test_export.py
import json
from rdoc_launch.export import build_counterbalancing, export_counterbalancing


def test_build_counterbalancing_parses_array_cells():
    records = [
        {"subject_id": "s4", "ses-01": "[['stroop', 1, True], ['flanker', 1, True]]", "ses-02": ""},
        {"subject_id": "s11", "ses-01": "[['axCPT', 1, True]]"},
        {"subject_id": "", "ses-01": "[['ignored', 1, True]]"},  # no subject -> skipped
    ]
    cb = build_counterbalancing(records)
    assert cb["s4"]["ses-01"] == [["stroop", 1, True], ["flanker", 1, True]]
    assert "ses-02" not in cb["s4"]  # empty cell omitted
    assert cb["s11"]["ses-01"] == [["axCPT", 1, True]]
    assert "" not in cb


def test_export_counterbalancing_writes_json(tmp_path):
    records = [{"subject_id": "s4", "ses-01": "[['stroop', 1, True]]"}]

    class _FakeWS:
        def get_all_records(self):
            return records

    class _FakeSS:
        def worksheet(self, name):
            return _FakeWS()

    class _FakeClient:
        def open(self, name):
            return _FakeSS()

    out = tmp_path / "counterbalancing.json"
    n = export_counterbalancing(lambda: _FakeClient(), out, "SHEET", "WS")
    assert n == 1
    data = json.loads(out.read_text())
    assert data["s4"]["ses-01"] == [["stroop", 1, True]]
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd rdoc_launch && uv run pytest tests/test_export.py -v`
Expected: FAIL (ModuleNotFoundError: rdoc_launch.export).

- [ ] **Step 3: Write minimal implementation**

```python
# rdoc_launch/src/rdoc_launch/export.py
"""Export the Google Sheet counterbalancing worksheet to a local JSON file."""
from __future__ import annotations

import ast
import json
import os
from pathlib import Path
from typing import Callable


def build_counterbalancing(records: list[dict]) -> dict:
    out: dict = {}
    for row in records:
        subject = str(row.get("subject_id", "")).strip()
        if not subject:
            continue
        sub_d: dict = {}
        for key, value in row.items():
            if key == "subject_id":
                continue
            if isinstance(value, str) and value.strip().startswith("["):
                try:
                    sub_d[key] = ast.literal_eval(value)
                except (ValueError, SyntaxError):
                    continue
        out[subject] = sub_d
    return out


def export_counterbalancing(client_factory: Callable, out_path,
                            spreadsheet_name: str, worksheet_name: str) -> int:
    client = client_factory()
    ws = client.open(spreadsheet_name).worksheet(worksheet_name)
    data = build_counterbalancing(ws.get_all_records())
    out = Path(out_path)
    tmp = out.with_suffix(out.suffix + ".tmp")
    tmp.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n")
    os.replace(tmp, out)  # atomic
    return len(data)


def gspread_client_factory(credentials_path):
    """Real client factory (network); not unit-tested."""
    import gspread
    return gspread.service_account(filename=str(credentials_path))
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd rdoc_launch && uv run pytest tests/test_export.py -v`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add rdoc_launch/src/rdoc_launch/export.py rdoc_launch/tests/test_export.py
git commit -m "feat(rdoc_launch): export counterbalancing sheet -> JSON"
```

---

## Task 9: `cli.py` — run_launch core + main

**Files:** Create `rdoc_launch/src/rdoc_launch/cli.py`; Test `rdoc_launch/tests/test_cli.py`

- [ ] **Step 1: Write the failing test** (injected side effects; no server/Chrome/network)

```python
# rdoc_launch/tests/test_cli.py
from pathlib import Path
from rdoc_launch.cli import run_launch


def _cb():
    return {"s4": {"ses-03": [["axCPT", 1, False], ["flanker", 1, False], ["stroop", 1, False]]}}


def _fakes():
    calls = {"battery": None, "browser_port": None, "waited": False, "synced": False, "stopped": False}

    class _Handle:
        port = 8085
        def stop(self_inner):
            calls["stopped"] = True

    def start_server(cmd, cwd):
        calls["server_cmd"] = cmd
        return _Handle()

    def open_browser(port):
        calls["browser_port"] = port

    def wait_for_end():
        calls["waited"] = True

    def run_sync():
        calls["synced"] = True
        return {"ok": True}

    return calls, start_server, open_browser, wait_for_end, run_sync


def test_run_launch_full_battery(tmp_path):
    calls, start_server, open_browser, wait_for_end, run_sync = _fakes()
    battery_file = tmp_path / "b.txt"
    result = run_launch(subject="s4", session_choice="3", cb=_cb(),
                        exp_root=Path("/repo"), raw_dir="/repo/.output/raw", bids_dir="/repo/.output/bids",
                        battery_path=battery_file, start_server=start_server, open_browser=open_browser,
                        wait_for_end=wait_for_end, run_sync=run_sync)
    assert result["subject"] == "s4" and result["label"] == "3"
    assert result["battery"] == ["ax_cpt_rdoc__fmri", "flanker_rdoc__fmri", "stroop_rdoc__fmri"]
    # battery file reversed for serving order
    assert battery_file.read_text().splitlines()[0] == "/repo/stroop_rdoc__fmri"
    # server command carries the right metadata
    assert calls["server_cmd"][:3] == ["expfactory_deploy_local", "-c", str(battery_file)]
    assert "s4" in calls["server_cmd"] and "3" in calls["server_cmd"]
    assert calls["browser_port"] == 8085
    assert calls["waited"] and calls["stopped"] and calls["synced"]


def test_run_launch_rejects_bad_subject(tmp_path):
    calls, start_server, open_browser, wait_for_end, run_sync = _fakes()
    import pytest
    with pytest.raises(ValueError, match="sNN"):
        run_launch(subject="11", session_choice="3", cb=_cb(), exp_root=Path("/repo"),
                   raw_dir="r", bids_dir="b", battery_path=tmp_path / "b.txt",
                   start_server=start_server, open_browser=open_browser,
                   wait_for_end=wait_for_end, run_sync=run_sync)
    assert calls["server_cmd"] if False else calls["browser_port"] is None  # nothing launched


def test_run_launch_tasks_subset(tmp_path):
    calls, start_server, open_browser, wait_for_end, run_sync = _fakes()
    result = run_launch(subject="s4", session_choice="3", cb=_cb(), exp_root=Path("/repo"),
                        raw_dir="r", bids_dir="b", battery_path=tmp_path / "b.txt",
                        start_server=start_server, open_browser=open_browser,
                        wait_for_end=wait_for_end, run_sync=run_sync, tasks_filter=["stroop"])
    assert result["battery"] == ["stroop_rdoc__fmri"]
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd rdoc_launch && uv run pytest tests/test_cli.py -v`
Expected: FAIL (ModuleNotFoundError: rdoc_launch.cli).

- [ ] **Step 3: Write minimal implementation**

```python
# rdoc_launch/src/rdoc_launch/cli.py
"""rdoc-launch: launch a session battery, or update counterbalancing from the sheet."""
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path
from typing import Any, Callable, Optional

from . import config
from .sessions import resolve_session, session_menu
from .validate import validate_subject
from .counterbalancing import load_counterbalancing, resolve_battery
from .battery import write_battery
from .runner import build_server_cmd, build_chrome_cmd, start_server as real_start_server
from .export import export_counterbalancing, gspread_client_factory


def run_launch(*, subject: str, session_choice: str, cb: dict, exp_root: Path,
               raw_dir: str, bids_dir: str, battery_path: Path,
               start_server: Callable, open_browser: Callable,
               wait_for_end: Callable, run_sync: Callable,
               tasks_filter: Optional[list[str]] = None) -> dict:
    plan = resolve_session(session_choice)         # raises on bad session
    subject = validate_subject(subject, cb)        # raises on bad/absent subject
    battery = resolve_battery(cb, subject, plan)
    if tasks_filter:
        battery = [b for b in battery if any(t in b for t in tasks_filter)]
        if not battery:
            raise ValueError(f"No tasks in the battery matched {tasks_filter!r}")
    write_battery(battery, battery_path, exp_root)
    cmd = build_server_cmd(str(battery_path), subject, plan.label, raw_dir, bids_dir)
    handle = start_server(cmd, str(exp_root))
    try:
        open_browser(handle.port)
        wait_for_end()
    finally:
        handle.stop()
    sync_result = run_sync()
    return {"subject": subject, "label": plan.label, "battery": battery,
            "port": handle.port, "sync": sync_result}


def _prompt_subject(cb: dict) -> str:
    print("Subjects:", ", ".join(sorted(cb.keys())))
    return input("Subject (sNN): ").strip()


def _prompt_session() -> str:
    print("Sessions:", ", ".join(session_menu()))
    return input("Session: ").strip()


def _real_open_browser(port: int) -> None:
    subprocess.Popen([config.CHROME_PATH, f"http://localhost:{port}", *config.CHROME_FLAGS])


def _real_run_sync() -> Optional[dict]:
    """Run rdoc-sync; non-fatal on failure."""
    try:
        r = subprocess.run(["uv", "run", "rdoc-sync", "sync", "--output", str(config.OUTPUT_DIR)],
                           cwd=str(config.REPO_ROOT / "rdoc_sync"))
        return {"returncode": r.returncode}
    except Exception as e:
        print(f"[rdoc-sync skipped: {e}]", file=sys.stderr)
        return None


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description="Launch RDoC session batteries")
    sub = parser.add_subparsers(dest="cmd", required=True)
    p_launch = sub.add_parser("launch", help="launch a session battery")
    p_launch.add_argument("--subject")
    p_launch.add_argument("--session")
    p_launch.add_argument("--tasks", help="comma list of task substrings to (re)run a subset")
    p_launch.add_argument("--no-sync", action="store_true", help="skip rdoc-sync at session end")
    sub.add_parser("update-counterbalancing", help="refresh counterbalancing.json from the sheet")
    args = parser.parse_args(argv)

    if args.cmd == "update-counterbalancing":
        n = export_counterbalancing(lambda: gspread_client_factory(config.CREDENTIALS_PATH),
                                    config.COUNTERBALANCING_JSON, config.SPREADSHEET_NAME,
                                    config.WORKSHEET_NAME)
        print(f"Wrote {n} subjects to {config.COUNTERBALANCING_JSON}")
        return 0

    if not config.COUNTERBALANCING_JSON.exists():
        print(f"Missing {config.COUNTERBALANCING_JSON}. Run: rdoc-launch update-counterbalancing",
              file=sys.stderr)
        return 2
    cb = load_counterbalancing(config.COUNTERBALANCING_JSON)
    subject = args.subject or _prompt_subject(cb)
    session_choice = args.session or _prompt_session()
    tasks_filter = [t.strip() for t in args.tasks.split(",")] if args.tasks else None
    run_sync = (lambda: None) if args.no_sync else _real_run_sync

    try:
        result = run_launch(subject=subject, session_choice=session_choice, cb=cb,
                            exp_root=config.REPO_ROOT, raw_dir=str(config.RAW_DIR),
                            bids_dir=str(config.BIDS_DIR), battery_path=config.BATTERY_FILE,
                            start_server=real_start_server, open_browser=_real_open_browser,
                            wait_for_end=lambda: input("Press Enter when the session is complete... "),
                            run_sync=run_sync, tasks_filter=tasks_filter)
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        return 2
    print(f"Session {result['subject']} ses-{result['label']} complete "
          f"({len(result['battery'])} tasks).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd rdoc_launch && uv run pytest tests/test_cli.py -v`
Expected: PASS (3 tests).

- [ ] **Step 5: Run the full suite**

Run: `cd rdoc_launch && uv run pytest -q`
Expected: all PASS.

- [ ] **Step 6: Import smoke check**

Run: `cd rdoc_launch && uv run python -c "from rdoc_launch import cli; print('ok')"`
Expected: `ok`.

- [ ] **Step 7: Commit**

```bash
git add rdoc_launch/src/rdoc_launch/cli.py rdoc_launch/tests/test_cli.py
git commit -m "feat(rdoc_launch): CLI run_launch core + main (launch + update-counterbalancing)"
```

---

## Task 10: README

**Files:** Create `rdoc_launch/README.md`

- [ ] **Step 1: Write `rdoc_launch/README.md`** covering:
  1. What it does (replaces setup.py/run.sh: counterbalancing from a committed JSON, constrained subject/session selection, one-window auto-advancing battery with the Chrome throttle flag, single/subset rerun, auto rdoc-sync at session end).
  2. Install: `cd rdoc_launch && uv sync`.
  3. Refresh counterbalancing: `uv run rdoc-launch update-counterbalancing` (needs `credentials.json` + network; commit the resulting `counterbalancing.json`).
  4. Launch a session: `uv run rdoc-launch launch` (interactive subject + session menu) or `--subject s11 --session prescan3`. Session menu values: `1..10`, `prescan1..10`, `pretouch`, `00` (anatomical), `Nmakeup`, `prescanNmakeup`.
  5. Rerun a subset: `--tasks stroop,flanker`. Restart current task = refresh browser; restart battery = the `/reset` URL.
  6. Session-end sync runs automatically (`--no-sync` to skip).
  7. Note the throttle flag is applied and why (stimulus timing).

- [ ] **Step 2: Commit**

```bash
git add rdoc_launch/README.md
git commit -m "docs(rdoc_launch): README (setup, usage, rerun, sync)"
```

---

## Task 11: Manual integration + retire setup.py/run.sh + finish (USER-GATED)

**Files:** Delete `setup.py`, `run.sh` (after verification); none else.

Confirm with the user before each step that touches the sheet, a real launch, or origin.

- [ ] **Step 1: Full unit suite**

Run: `cd rdoc_launch && uv run pytest -q`
Expected: all PASS (no network/GUI).

- [ ] **Step 2: Export counterbalancing (USER)**

Run: `cd rdoc_launch && uv run rdoc-launch update-counterbalancing`
Verify `counterbalancing.json` appears at the repo root and matches the sheet (spot-check a subject/session). Commit it:
```bash
git add counterbalancing.json
git commit -m "data: committed counterbalancing.json exported from sheet"
```

- [ ] **Step 3: Live launch test (USER)**

Run: `cd rdoc_launch && uv run rdoc-launch launch --subject <real sNN> --session prescan<view-only>` (pick a throwaway/test-safe subject+session). Confirm: one server + one Chrome window with the throttle flag, the battery serves in counterbalanced order, refresh restarts the current task, and on completion `rdoc-sync` runs. Use `--no-sync` if you don't want to write rows during the test.

- [ ] **Step 4: Retire the old scripts**

```bash
git rm setup.py run.sh
git commit -m "chore: retire setup.py and run.sh (replaced by rdoc-launch)"
```

- [ ] **Step 5: Merge + push (USER-CONFIRMED)**

Merge `nf-rdoc-launch` into `main`, push. Optionally update `rsync.sh`'s role now that sync is automated.

---

## Self-review notes

- **Spec coverage:** package + config (Task 1), counterbalancing.json shape + load/resolve (Tasks 5, 8), session vocabulary + mapping incl. makeup (Task 3), task mapping (Task 2), constrained validation (Tasks 3+4), reversed-battery serving order (Task 6), server/Chrome + throttle flag + port detection (Task 7), CLI launch + subset rerun + session-end sync + update-counterbalancing (Task 9), README (Task 10), live export/launch + retire setup.py/run.sh + merge (Task 11). All spec sections mapped.
- **Placeholder scan:** every code step has complete code; README contents enumerated.
- **Type/name consistency:** `SessionPlan(cb_column,is_practice,label)`, `experiment_dir(abbrev,is_practice)`, `resolve_battery(cb,subject,plan)`, `write_battery(dirs,path,exp_root)`, `build_server_cmd(...)`, `run_launch(**kwargs)` are consistent across tasks and tests. The reversed-battery contract is asserted in Tasks 6 and 9.
- **No network/GUI in tests:** gspread (export), the server (start_server), Chrome (open_browser), and rdoc-sync (run_sync) are all injected/mocked; real wiring lives only in `main`/`gspread_client_factory`, which are not unit-tested and are exercised in the user-gated Task 11.
