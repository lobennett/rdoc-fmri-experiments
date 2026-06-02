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
