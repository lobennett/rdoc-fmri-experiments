import json
from pathlib import Path
from rdoc_sync.parse import parse_filename, parse_run, RunRecord


def test_parse_filename_full():
    info = parse_filename("sub-s11_ses-1_run-1_task-stroop_rdoc__fmri_dateTime-1700000000.json")
    assert info["subject_id"] == "s11"
    assert info["session"] == "1"
    assert info["run"] == "1"
    assert info["task"] == "stroop_rdoc__fmri"
    assert info["date_time_unix"] == 1700000000


def test_parse_filename_practice_and_flags():
    info = parse_filename("sub-s4_ses-prescan3_run-1_task-flanker_rdoc_practice__fmri_dateTime-100.json")
    assert info["task"] == "flanker_rdoc_practice__fmri"
    assert info["is_practice"] is True
    assert info["is_fmri"] is True


def _write_raw(tmp_path, rel, payload):
    p = tmp_path / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(payload))
    return p


def test_parse_run_dict_payload(tmp_path):
    trials = [{"design_perm": 5, "motor_perm": 2, "rt": 1}, {"design_perm": 5, "rt": 2}]
    rel = "raw/sub-s11/ses-1/sub-s11_ses-1_run-1_task-stroop_rdoc__fmri_dateTime-1700000000.json"
    _write_raw(tmp_path, rel, {"trialdata": json.dumps(trials), "exp_id": "stroop_rdoc__fmri"})
    rec = parse_run(tmp_path / rel, output_root=tmp_path)
    assert isinstance(rec, RunRecord)
    assert rec.subject_id == "s11" and rec.session == "1" and rec.run == "1"
    assert rec.task == "stroop_rdoc__fmri"
    assert rec.is_fmri is True and rec.is_practice is False
    assert rec.date_time == "2023-11-14T22:13:20+00:00"
    assert rec.design_perm == 5 and rec.motor_perm == 2
    assert rec.n_trials == 2
    assert rec.raw_path == rel
    assert rec.bids_path == "bids/sub-s11/ses-1/func/sub-s11_ses-1_run-1_task-stroop_rdoc__fmri.csv"
    assert rec.trialdata == trials


def test_parse_run_bare_list_payload(tmp_path):
    trials = [{"rt": 1}, {"rt": 2}, {"rt": 3}]
    rel = "raw/sub-s5/ses-pretouch/sub-s5_ses-pretouch_run-1_task-go_nogo_rdoc_practice__fmri_dateTime-100.json"
    _write_raw(tmp_path, rel, trials)
    rec = parse_run(tmp_path / rel, output_root=tmp_path)
    assert rec.n_trials == 3 and rec.design_perm is None
    assert rec.is_practice is True
    assert rec.bids_path is not None
