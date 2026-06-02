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
