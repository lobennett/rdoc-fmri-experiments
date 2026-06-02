"""Typed settings loaded from a .env file (per machine)."""
from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

from dotenv import dotenv_values


@dataclass(frozen=True)
class Settings:
    supabase_url: str
    supabase_key: str
    dropbox_remote: str


_REQUIRED = ("SUPABASE_URL", "SUPABASE_KEY", "DROPBOX_REMOTE")


def load_settings(env_path: Optional[Path] = None) -> Settings:
    """Load settings from a .env file, falling back to process env vars."""
    values = dict(os.environ)
    if env_path is not None:
        values.update({k: v for k, v in dotenv_values(env_path).items() if v is not None})
    missing = [k for k in _REQUIRED if not values.get(k)]
    if missing:
        raise ValueError(f"Missing required setting(s): {', '.join(missing)}")
    return Settings(
        supabase_url=values["SUPABASE_URL"],
        supabase_key=values["SUPABASE_KEY"],
        dropbox_remote=values["DROPBOX_REMOTE"],
    )
