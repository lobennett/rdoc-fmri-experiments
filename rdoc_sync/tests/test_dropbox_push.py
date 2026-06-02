from pathlib import Path
from rdoc_sync.dropbox_push import push_run


def _make(tmp_path, rel):
    p = tmp_path / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text("x")
    return p


def test_push_run_copies_raw_and_existing_bids(tmp_path):
    _make(tmp_path, "raw/sub-s11/ses-1/a.json")
    _make(tmp_path, "bids/sub-s11/ses-1/func/a.csv")
    calls = []
    def runner(cmd, **kw):
        calls.append(cmd)
        class R:
            returncode = 0
        return R()
    push_run("remote:base", tmp_path,
             "raw/sub-s11/ses-1/a.json", "bids/sub-s11/ses-1/func/a.csv", runner=runner)
    assert calls[0] == ["rclone", "copyto", str(tmp_path / "raw/sub-s11/ses-1/a.json"),
                        "remote:base/raw/sub-s11/ses-1/a.json"]
    assert calls[1] == ["rclone", "copyto", str(tmp_path / "bids/sub-s11/ses-1/func/a.csv"),
                        "remote:base/bids/sub-s11/ses-1/func/a.csv"]


def test_push_run_skips_missing_bids(tmp_path):
    _make(tmp_path, "raw/x.json")
    calls = []
    def runner(cmd, **kw):
        calls.append(cmd)
        class R:
            returncode = 0
        return R()
    push_run("remote:base", tmp_path, "raw/x.json", "bids/missing.csv", runner=runner)
    assert len(calls) == 1  # only raw pushed; missing bids skipped


def test_push_run_none_bids(tmp_path):
    _make(tmp_path, "raw/x.json")
    calls = []
    def runner(cmd, **kw):
        calls.append(cmd)
        class R:
            returncode = 0
        return R()
    push_run("remote:base", tmp_path, "raw/x.json", None, runner=runner)
    assert len(calls) == 1
