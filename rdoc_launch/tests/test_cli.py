from pathlib import Path
from rdoc_launch.cli import run_launch


def _cb():
    return {"s4": {"ses-03": [["axCPT", 1, False], ["flanker", 1, False], ["stroop", 1, False]]}}


def _fakes():
    calls = {"battery": None, "browser_port": None, "waited": False, "synced": False, "stopped": False}

    class _Handle:
        port = 8085
        def stop(self_inner):
            calls["stopped"] = True

    def start_server(cmd, cwd):
        calls["server_cmd"] = cmd
        return _Handle()

    def open_browser(port):
        calls["browser_port"] = port

    def wait_for_end():
        calls["waited"] = True

    def run_sync():
        calls["synced"] = True
        return {"ok": True}

    return calls, start_server, open_browser, wait_for_end, run_sync


def test_run_launch_full_battery(tmp_path):
    calls, start_server, open_browser, wait_for_end, run_sync = _fakes()
    battery_file = tmp_path / "b.txt"
    result = run_launch(subject="s4", session_choice="3", cb=_cb(),
                        exp_root=Path("/repo"), raw_dir="/repo/.output/raw", bids_dir="/repo/.output/bids",
                        battery_path=battery_file, start_server=start_server, open_browser=open_browser,
                        wait_for_end=wait_for_end, run_sync=run_sync)
    assert result["subject"] == "s4" and result["label"] == "3"
    assert result["battery"] == ["ax_cpt_rdoc__fmri", "flanker_rdoc__fmri", "stroop_rdoc__fmri"]
    assert battery_file.read_text().splitlines()[0] == "/repo/stroop_rdoc__fmri"
    assert calls["server_cmd"][:3] == ["expfactory_deploy_local", "-c", str(battery_file)]
    assert "s4" in calls["server_cmd"] and "3" in calls["server_cmd"]
    assert calls["browser_port"] == 8085
    assert calls["waited"] and calls["stopped"] and calls["synced"]


def test_run_launch_rejects_bad_subject(tmp_path):
    import pytest
    calls, start_server, open_browser, wait_for_end, run_sync = _fakes()
    with pytest.raises(ValueError, match="sNN"):
        run_launch(subject="11", session_choice="3", cb=_cb(), exp_root=Path("/repo"),
                   raw_dir="r", bids_dir="b", battery_path=tmp_path / "b.txt",
                   start_server=start_server, open_browser=open_browser,
                   wait_for_end=wait_for_end, run_sync=run_sync)
    assert calls["browser_port"] is None  # nothing launched


def test_run_launch_tasks_subset(tmp_path):
    calls, start_server, open_browser, wait_for_end, run_sync = _fakes()
    result = run_launch(subject="s4", session_choice="3", cb=_cb(), exp_root=Path("/repo"),
                        raw_dir="r", bids_dir="b", battery_path=tmp_path / "b.txt",
                        start_server=start_server, open_browser=open_browser,
                        wait_for_end=wait_for_end, run_sync=run_sync, tasks_filter=["stroop"])
    assert result["battery"] == ["stroop_rdoc__fmri"]
