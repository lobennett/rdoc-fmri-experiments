"""Canonicalize identifiers and flag anomalies. Never blocks ingest."""
from __future__ import annotations

import re

from .parse import RunRecord

KNOWN_TASKS = {
    "stroop", "flanker", "go_nogo", "ax_cpt", "spatial_cueing", "n_back",
    "cued_task_switching", "spatial_task_switching", "stop_signal",
    "visual_search", "simple_span", "operation_span", "operation_only_span",
}

_SESSION_RE = re.compile(r"^(?:\d+|prescan\d+|pretouch|anat|\d+makeup|prescan\d+makeup)$")
_CANON_SUBJECT_RE = re.compile(r"^s\d+$")
_NUMERIC_SUBJECT_RE = re.compile(r"^\d+$")


def _task_base(task: str) -> str:
    # strip the _rdoc[_practice]__fmri suffix to get the bare task name
    return re.sub(r"_rdoc(?:_practice)?__fmri$", "", task)


def normalize_record(rec: RunRecord) -> RunRecord:
    flags: list[str] = []

    sub = rec.subject_id
    if sub is None:
        flags.append("missing subject id")
    elif _CANON_SUBJECT_RE.match(sub):
        pass
    elif _NUMERIC_SUBJECT_RE.match(sub):
        new = f"s{sub}"
        flags.append(f"subject id normalized '{sub}' -> '{new}'")
        rec.subject_id = new
    else:
        flags.append(f"unrecognized subject id '{sub}'")

    if rec.session is None:
        flags.append("missing session")
    elif not _SESSION_RE.match(rec.session):
        flags.append(f"unexpected session '{rec.session}'")

    if _task_base(rec.task) not in KNOWN_TASKS:
        flags.append(f"unknown task '{rec.task}'")

    rec.flags = flags
    return rec
