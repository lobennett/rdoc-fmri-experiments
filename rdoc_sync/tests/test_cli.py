import json
import pytest
from pathlib import Path
from rdoc_sync.cli import run_sync


class _FakeClient:
    def __init__(self):
        self.upserts = []
    def table(self, name):
        self._name = name
        return self
    def upsert(self, payload, on_conflict=None):
        self.upserts.append(payload)
        return self
    def execute(self):
        return {"ok": True}


def _runner_factory(calls):
    def runner(cmd, **kw):
        calls.append(cmd)
        class R:
            returncode = 0
        return R()
    return runner


def _write_run(root, sub="s11", ses="1", task="stroop_rdoc__fmri", dt="1700000000"):
    rel = f"raw/sub-{sub}/ses-{ses}/sub-{sub}_ses-{ses}_run-1_task-{task}_dateTime-{dt}.json"
    p = root / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps({"trialdata": json.dumps([{"design_perm": 5, "motor_perm": 2}])}))
    return rel


def test_run_sync_upserts_and_pushes(tmp_path):
    _write_run(tmp_path)
    client = _FakeClient()
    calls = []
    report = tmp_path / "r.md"
    result = run_sync(root=tmp_path, client=client, remote="remote:base",
                      runner=_runner_factory(calls), hostname="mac1",
                      exp_git_sha="abc", report_path=report, dry_run=False)
    assert result["n_runs"] == 1
    assert len(client.upserts) == 1
    assert client.upserts[0]["subject_id"] == "s11"
    assert client.upserts[0]["hostname"] == "mac1"
    assert any("copyto" in c for c in calls[0])  # raw pushed
    assert report.exists()


def test_run_sync_dry_run_writes_nothing(tmp_path):
    _write_run(tmp_path, sub="11")  # malformed -> should be flagged
    client = _FakeClient()
    calls = []
    result = run_sync(root=tmp_path, client=client, remote="remote:base",
                      runner=_runner_factory(calls), hostname="mac1",
                      exp_git_sha=None, report_path=tmp_path / "r.md", dry_run=True)
    assert result["n_runs"] == 1
    assert client.upserts == []   # dry-run: no upserts
    assert calls == []            # dry-run: no rclone
    assert result["n_flagged"] == 1  # subject '11' normalized+flagged


def test_run_sync_missing_raw_dir_raises(tmp_path):
    import pytest
    with pytest.raises(FileNotFoundError, match="raw/"):
        run_sync(root=tmp_path, client=None, remote="", runner=lambda *a, **k: None,
                 hostname=None, exp_git_sha=None, report_path=tmp_path / "r.md", dry_run=True)


def test_run_sync_skip_dropbox_upserts_but_no_rclone(tmp_path):
    _write_run(tmp_path)
    client = _FakeClient()
    calls = []
    result = run_sync(root=tmp_path, client=client, remote="remote:base",
                      runner=_runner_factory(calls), hostname=None, exp_git_sha=None,
                      report_path=tmp_path / "r.md", dry_run=False, skip_dropbox=True)
    assert result["n_runs"] == 1
    assert len(client.upserts) == 1   # still upserts to Supabase
    assert calls == []                # but no rclone push
