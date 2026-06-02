"""Build the Supabase `runs` row dict from a RunRecord + environment fields."""
from __future__ import annotations

from typing import Optional

from .parse import RunRecord


def to_payload(rec: RunRecord, hostname: Optional[str], exp_git_sha: Optional[str],
               synced_at: str) -> dict:
    return {
        "subject_id": rec.subject_id,
        "session": rec.session,
        "run": rec.run,
        "task": rec.task,
        "is_practice": rec.is_practice,
        "is_fmri": rec.is_fmri,
        "date_time": rec.date_time,
        "design_perm": rec.design_perm,
        "motor_perm": rec.motor_perm,
        "n_records": rec.n_records,
        "hostname": hostname,
        "exp_git_sha": exp_git_sha,
        "raw_path": rec.raw_path,
        "bids_path": rec.bids_path,
        "source_filename": rec.source_filename,
        "flags": rec.flags,
        "synced_at": synced_at,
        "trialdata": rec.trialdata,
    }
