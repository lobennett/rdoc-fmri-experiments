"""rdoc-sync CLI: ingest a .output tree -> Supabase + Dropbox."""
from __future__ import annotations

import argparse
import datetime as _dt
import socket
import subprocess
import sys
from pathlib import Path
from typing import Any, Callable, Optional

from .config import load_settings
from .parse import parse_run
from .normalize import normalize_record
from .payload import to_payload
from .supabase_client import build_client, upsert_run
from .dropbox_push import push_run
from .report import write_report


def _discover(root: Path) -> list[Path]:
    raw = root / "raw"
    if not raw.is_dir():
        raise FileNotFoundError(f"No 'raw/' directory under {root}")
    return sorted(raw.rglob("*.json"))


def _git_sha(cwd: Optional[Path] = None) -> Optional[str]:
    try:
        out = subprocess.run(["git", "rev-parse", "HEAD"], cwd=cwd,
                             capture_output=True, text=True, check=True)
        return out.stdout.strip()
    except Exception:
        return None


def run_sync(root: Path, client: Any, remote: str, runner: Callable,
             hostname: Optional[str], exp_git_sha: Optional[str],
             report_path: Path, dry_run: bool, skip_dropbox: bool = False) -> dict:
    synced_at = _dt.datetime.now(_dt.timezone.utc).isoformat()
    rows: list[dict] = []
    failures = 0
    for path in _discover(root):
        try:
            rec = normalize_record(parse_run(path, output_root=root))
        except Exception as e:  # hard parse failure -> record + report, continue
            rows.append({"source_filename": path.name, "flags": [f"parse error: {e}"]})
            failures += 1
            continue
        payload = to_payload(rec, hostname=hostname, exp_git_sha=exp_git_sha, synced_at=synced_at)
        if not dry_run:
            try:
                upsert_run(client, payload)
                if not skip_dropbox:
                    push_run(remote, root, rec.raw_path, rec.bids_path, runner=runner)
            except Exception as e:
                rec.flags.append(f"push error: {e}")
                failures += 1
        rows.append({"source_filename": rec.source_filename, "flags": rec.flags})
    n_flagged = write_report(rows, report_path)
    return {"n_runs": len(rows), "n_flagged": n_flagged, "failures": failures}


def from_dropbox(*, remote: str, staging: Path, client: Any, report_path: Path,
                 dry_run: bool, rclone_runner: Callable, run_sync_fn: Callable) -> dict:
    """Pull the Dropbox raw/ tree into a persistent staging dir, then upsert to
    Supabase only (no Dropbox push -- the source IS Dropbox)."""
    staging = Path(staging)
    raw_staging = staging / "raw"
    raw_staging.mkdir(parents=True, exist_ok=True)
    # NOTE: rclone `copy` does not delete files removed upstream; they linger in
    # staging and keep being re-ingested (idempotent upsert, so no dup rows). Switch
    # to `rclone sync` if you need staging to mirror upstream deletions.
    # NOTE: dry-run still pulls so the preview reflects current Dropbox state; only
    # the Supabase upsert is skipped (via dry_run -> run_sync).
    rclone_runner(["rclone", "copy", f"{remote}/raw", str(raw_staging)], check=True)
    result = run_sync_fn(root=staging, client=client, remote=remote,
                         runner=rclone_runner, hostname=None, exp_git_sha=None,
                         report_path=report_path, dry_run=dry_run, skip_dropbox=True)
    result["staging"] = str(staging)
    return result


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description="Sync RDoC runs to Supabase + Dropbox")
    sub = parser.add_subparsers(dest="cmd", required=True)
    p_sync = sub.add_parser("sync", help="ingest a local .output tree")
    p_sync.add_argument("--output", type=Path, default=Path("./.output"))
    p_back = sub.add_parser("backfill", help="ingest a staging dir (corpus backfill)")
    p_back.add_argument("--staging", type=Path, required=True)
    p_back.add_argument("--skip-dropbox", action="store_true",
                        help="Only upsert to Supabase; skip the redundant Dropbox push")
    p_from = sub.add_parser("from-dropbox", help="pull Dropbox raw/ and upsert to Supabase (recurring)")
    p_from.add_argument("--staging", type=Path,
                        default=Path.home() / ".cache" / "rdoc-sync" / "staging")
    p_from.add_argument("--report", type=Path, default=Path("./rdoc-from-dropbox-report.md"))
    p_from.add_argument("--dry-run", action="store_true")
    p_from.add_argument("--env", type=Path, default=Path(".env"))
    for p in (p_sync, p_back):
        p.add_argument("--report", type=Path, default=Path("./rdoc-sync-report.md"))
        p.add_argument("--dry-run", action="store_true")
        p.add_argument("--env", type=Path, default=Path(".env"))
    args = parser.parse_args(argv)

    if args.cmd == "from-dropbox":
        settings = load_settings(env_path=args.env if args.env.exists() else None)
        client = None if args.dry_run else build_client(settings)
        try:
            result = from_dropbox(remote=settings.dropbox_remote, staging=args.staging,
                                  client=client, report_path=args.report, dry_run=args.dry_run,
                                  rclone_runner=subprocess.run, run_sync_fn=run_sync)
        except subprocess.CalledProcessError as e:
            print(f"rclone pull failed (exit {e.returncode}); nothing ingested", file=sys.stderr)
            return 2
        print(f"runs={result['n_runs']} flagged={result['n_flagged']} "
              f"failures={result['failures']} staging={result['staging']}")
        print(f"report: {args.report}")
        return 1 if result["failures"] else 0

    root = args.output if args.cmd == "sync" else args.staging
    if not root.exists():
        print(f"Root not found: {root}", file=sys.stderr)
        return 2

    if args.dry_run:
        client = None
        remote = ""
    else:
        settings = load_settings(env_path=args.env if args.env.exists() else None)
        client = build_client(settings)
        remote = settings.dropbox_remote

    hostname = socket.gethostname() if args.cmd == "sync" else None
    sha = _git_sha() if args.cmd == "sync" else None

    result = run_sync(root=root, client=client, remote=remote,
                      runner=subprocess.run, hostname=hostname, exp_git_sha=sha,
                      report_path=args.report, dry_run=args.dry_run,
                      skip_dropbox=getattr(args, "skip_dropbox", False))
    print(f"runs={result['n_runs']} flagged={result['n_flagged']} failures={result['failures']}")
    print(f"report: {args.report}")
    return 1 if result["failures"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
