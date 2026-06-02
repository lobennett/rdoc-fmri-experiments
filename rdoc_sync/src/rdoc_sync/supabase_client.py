"""Thin Supabase wrapper. build_client is untested (network); upsert_run is injectable."""
from __future__ import annotations

from typing import Any

from .config import Settings

ON_CONFLICT = "subject_id,session,run,task,date_time"
TABLE = "runs"


def build_client(settings: Settings):
    from supabase import create_client  # imported lazily so tests need no network/dep stub
    return create_client(settings.supabase_url, settings.supabase_key)


def upsert_run(client: Any, payload: dict) -> None:
    client.table(TABLE).upsert(payload, on_conflict=ON_CONFLICT).execute()
