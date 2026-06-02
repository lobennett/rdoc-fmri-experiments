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
