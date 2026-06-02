"""rdoc-launch: launch a session battery, or update counterbalancing from the sheet."""
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path
from typing import Any, Callable, Optional

from . import config
from .sessions import resolve_session, session_menu
from .validate import validate_subject
from .counterbalancing import load_counterbalancing, resolve_battery
from .battery import write_battery
from .runner import build_server_cmd, build_chrome_cmd, start_server as real_start_server
from .export import export_counterbalancing, gspread_client_factory


def run_launch(*, subject: str, session_choice: str, cb: dict, exp_root: Path,
               raw_dir: str, bids_dir: str, battery_path: Path,
               start_server: Callable, open_browser: Callable,
               wait_for_end: Callable, run_sync: Callable,
               tasks_filter: Optional[list[str]] = None) -> dict:
    plan = resolve_session(session_choice)         # raises on bad session
    subject = validate_subject(subject, cb)        # raises on bad/absent subject
    battery = resolve_battery(cb, subject, plan)
    if tasks_filter:
        battery = [b for b in battery if any(t in b for t in tasks_filter)]
        if not battery:
            raise ValueError(f"No tasks in the battery matched {tasks_filter!r}")
    write_battery(battery, battery_path, exp_root)
    cmd = build_server_cmd(str(battery_path), subject, plan.label, raw_dir, bids_dir)
    handle = start_server(cmd, str(exp_root))
    try:
        open_browser(handle.port)
        wait_for_end()
    finally:
        handle.stop()
    sync_result = run_sync()
    return {"subject": subject, "label": plan.label, "battery": battery,
            "port": handle.port, "sync": sync_result}


def _prompt_subject(cb: dict) -> str:
    print("Subjects:", ", ".join(sorted(cb.keys())))
    return input("Subject (sNN): ").strip()


def _prompt_session() -> str:
    print("Sessions:", ", ".join(session_menu()))
    return input("Session: ").strip()


def _real_open_browser(port: int) -> None:
    subprocess.Popen([config.CHROME_PATH, f"http://localhost:{port}", *config.CHROME_FLAGS])


def _real_run_sync() -> Optional[dict]:
    """Run rdoc-sync; non-fatal on failure."""
    try:
        r = subprocess.run(["uv", "run", "rdoc-sync", "sync", "--output", str(config.OUTPUT_DIR)],
                           cwd=str(config.REPO_ROOT / "rdoc_sync"))
        return {"returncode": r.returncode}
    except Exception as e:
        print(f"[rdoc-sync skipped: {e}]", file=sys.stderr)
        return None


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description="Launch RDoC session batteries")
    sub = parser.add_subparsers(dest="cmd", required=True)
    p_launch = sub.add_parser("launch", help="launch a session battery")
    p_launch.add_argument("--subject")
    p_launch.add_argument("--session")
    p_launch.add_argument("--tasks", help="comma list of task substrings to (re)run a subset")
    p_launch.add_argument("--no-sync", action="store_true", help="skip rdoc-sync at session end")
    sub.add_parser("update-counterbalancing", help="refresh counterbalancing.json from the sheet")
    args = parser.parse_args(argv)

    if args.cmd == "update-counterbalancing":
        n = export_counterbalancing(lambda: gspread_client_factory(config.CREDENTIALS_PATH),
                                    config.COUNTERBALANCING_JSON, config.SPREADSHEET_NAME,
                                    config.WORKSHEET_NAME)
        print(f"Wrote {n} subjects to {config.COUNTERBALANCING_JSON}")
        return 0

    if not config.COUNTERBALANCING_JSON.exists():
        print(f"Missing {config.COUNTERBALANCING_JSON}. Run: rdoc-launch update-counterbalancing",
              file=sys.stderr)
        return 2
    cb = load_counterbalancing(config.COUNTERBALANCING_JSON)
    subject = args.subject or _prompt_subject(cb)
    session_choice = args.session or _prompt_session()
    tasks_filter = [t.strip() for t in args.tasks.split(",")] if args.tasks else None
    run_sync = (lambda: None) if args.no_sync else _real_run_sync

    try:
        result = run_launch(subject=subject, session_choice=session_choice, cb=cb,
                            exp_root=config.REPO_ROOT, raw_dir=str(config.RAW_DIR),
                            bids_dir=str(config.BIDS_DIR), battery_path=config.BATTERY_FILE,
                            start_server=real_start_server, open_browser=_real_open_browser,
                            wait_for_end=lambda: input("Press Enter when the session is complete... "),
                            run_sync=run_sync, tasks_filter=tasks_filter)
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        return 2
    print(f"Session {result['subject']} ses-{result['label']} complete "
          f"({len(result['battery'])} tasks).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
