"""Write a markdown report of flagged runs."""
from __future__ import annotations

from pathlib import Path


def write_report(rows: list[dict], out_path: Path) -> int:
    flagged = [r for r in rows if r.get("flags")]
    lines = ["# rdoc-sync anomaly report", ""]
    if not flagged:
        lines.append("No anomalies found.")
    else:
        lines.append(f"{len(flagged)} run(s) flagged:")
        lines.append("")
        for r in flagged:
            lines.append(f"- `{r['source_filename']}`")
            for f in r["flags"]:
                lines.append(f"    - {f}")
    Path(out_path).write_text("\n".join(lines) + "\n")
    return len(flagged)
