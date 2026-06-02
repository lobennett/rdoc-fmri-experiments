"""Repo-root-derived paths and constants for the launcher."""
from __future__ import annotations

from pathlib import Path

# config.py -> src/rdoc_launch -> src -> rdoc_launch -> repo root
REPO_ROOT = Path(__file__).resolve().parents[3]

OUTPUT_DIR = REPO_ROOT / ".output"
RAW_DIR = OUTPUT_DIR / "raw"
BIDS_DIR = OUTPUT_DIR / "bids"
COUNTERBALANCING_JSON = REPO_ROOT / "counterbalancing.json"
CREDENTIALS_PATH = REPO_ROOT / "credentials.json"
BATTERY_FILE = REPO_ROOT / ".rdoc-launch-battery.txt"

SPREADSHEET_NAME = "r01_rdoc_participant_tracking"
WORKSHEET_NAME = "counterbalancing"

CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
CHROME_FLAGS = ["--disable-background-timer-throttling", "--new-window"]
