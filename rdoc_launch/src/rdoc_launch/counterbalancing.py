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
