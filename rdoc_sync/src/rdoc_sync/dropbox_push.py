"""Push raw+bids files to a Dropbox rclone remote (one-way, local -> remote)."""
from __future__ import annotations

import subprocess
from pathlib import Path
from typing import Callable, Optional


def _copy(remote: str, root: Path, rel: str, runner: Callable) -> None:
    src = str(root / rel)
    dst = f"{remote}/{rel}"
    result = runner(["rclone", "copyto", src, dst], check=True)
    if getattr(result, "returncode", 0) != 0:
        raise RuntimeError(f"rclone copyto failed for {rel}")


def push_run(remote: str, root: Path, raw_rel: str, bids_rel: Optional[str],
             runner: Callable = subprocess.run) -> None:
    _copy(remote, root, raw_rel, runner)
    if bids_rel and (root / bids_rel).exists():
        _copy(remote, root, bids_rel, runner)
