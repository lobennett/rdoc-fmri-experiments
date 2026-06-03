from rdoc_sync.parse import RunRecord
from rdoc_sync.payload import to_payload


def _rec():
    return RunRecord(subject_id="s11", session="1", run="1", task="stroop_rdoc__fmri",
                     is_practice=False, is_fmri=True, date_time="2023-01-01T00:00:00+00:00",
                     design_perm=5, motor_perm=2, n_records=2, raw_path="raw/a.json",
                     bids_path="bids/a.csv", source_filename="a.json",
                     trialdata=[{"rt": 1}], flags=["x"])


def test_to_payload_has_all_columns():
    p = to_payload(_rec(), hostname="mac1", exp_git_sha="abc123", synced_at="2026-06-01T00:00:00+00:00")
    assert p["subject_id"] == "s11"
    assert p["task"] == "stroop_rdoc__fmri"
    assert p["is_practice"] is False and p["is_fmri"] is True
    assert p["date_time"] == "2023-01-01T00:00:00+00:00"
    assert p["design_perm"] == 5 and p["motor_perm"] == 2
    assert p["n_records"] == 2
    assert p["hostname"] == "mac1" and p["exp_git_sha"] == "abc123"
    assert p["raw_path"] == "raw/a.json" and p["bids_path"] == "bids/a.csv"
    assert p["source_filename"] == "a.json"
    assert p["flags"] == ["x"]
    assert p["synced_at"] == "2026-06-01T00:00:00+00:00"
    assert p["trialdata"] == [{"rt": 1}]
