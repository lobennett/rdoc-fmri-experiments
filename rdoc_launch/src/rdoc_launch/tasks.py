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
