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
