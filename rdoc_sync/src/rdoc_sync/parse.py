"""Parse a raw run JSON file into a RunRecord."""
from __future__ import annotations

import datetime as _dt
import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Optional

_FILENAME_RE = re.compile(
    r"^(?:sub-(?P<sub>[^_]+)_)?(?:ses-(?P<ses>[^_]+)_)?(?:run-(?P<run>[^_]+)_)?"
    r"task-(?P<task>.+?)_dateTime-(?P<dt>\d+)\.json$"
)


@dataclass
class RunRecord:
    subject_id: Optional[str]
    session: Optional[str]
    run: Optional[str]
    task: str
    is_practice: bool
    is_fmri: bool
    date_time: str            # ISO8601 UTC
    design_perm: Optional[int]
    motor_perm: Optional[int]
    n_records: int
    raw_path: str             # relative to output root
    bids_path: Optional[str]  # relative; None when not __fmri
    source_filename: str
    trialdata: list
    flags: list = field(default_factory=list)


def parse_filename(name: str) -> dict[str, Any]:
    m = _FILENAME_RE.match(name)
    if not m:
        raise ValueError(f"Unrecognized run filename: {name}")
    task = m.group("task")
    return {
        "subject_id": m.group("sub"),
        "session": m.group("ses"),
        "run": m.group("run"),
        "task": task,
        "is_practice": "_practice" in task,
        "is_fmri": "__fmri" in task,
        "date_time_unix": int(m.group("dt")),
    }


def _trials(payload: Any) -> list:
    if isinstance(payload, list):
        return payload
    td = payload.get("trialdata")
    return json.loads(td) if isinstance(td, str) else (td or [])


def _first(trials: list, key: str) -> Optional[int]:
    for t in trials:
        if isinstance(t, dict) and t.get(key) is not None:
            return t[key]
    return None


def _bids_rel(info: dict, raw_rel: str) -> Optional[str]:
    if not info["is_fmri"]:
        return None
    name = Path(raw_rel).name
    csv = re.sub(r"_dateTime-\d+\.json$", ".csv", name)
    parts = ["bids"]
    if info["subject_id"]:
        parts.append(f"sub-{info['subject_id']}")
    if info["session"]:
        parts.append(f"ses-{info['session']}")
    parts.append("func")
    parts.append(csv)
    return "/".join(parts)


def parse_run(path: Path, output_root: Path) -> RunRecord:
    info = parse_filename(path.name)
    payload = json.loads(path.read_text())
    trials = _trials(payload)
    raw_rel = str(path.relative_to(output_root))
    dt = _dt.datetime.fromtimestamp(info["date_time_unix"], tz=_dt.timezone.utc)
    return RunRecord(
        subject_id=info["subject_id"],
        session=info["session"],
        run=info["run"],
        task=info["task"],
        is_practice=info["is_practice"],
        is_fmri=info["is_fmri"],
        date_time=dt.isoformat(),
        design_perm=_first(trials, "design_perm"),
        motor_perm=_first(trials, "motor_perm"),
        n_records=len(trials),
        raw_path=raw_rel,
        bids_path=_bids_rel(info, raw_rel),
        source_filename=path.name,
        trialdata=trials,
    )
