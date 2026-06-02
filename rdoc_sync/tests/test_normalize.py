from rdoc_sync.parse import RunRecord
from rdoc_sync.normalize import normalize_record


def _rec(**kw):
    base = dict(subject_id="s11", session="1", run="1", task="stroop_rdoc__fmri",
                is_practice=False, is_fmri=True, date_time="2023-01-01T00:00:00+00:00",
                design_perm=5, motor_perm=2, n_trials=10, raw_path="raw/x.json",
                bids_path="bids/x.csv", source_filename="x.json", trialdata=[])
    base.update(kw)
    return RunRecord(**base)


def test_clean_record_has_no_flags():
    rec = normalize_record(_rec())
    assert rec.subject_id == "s11"
    assert rec.flags == []


def test_numeric_subject_is_canonicalized_and_flagged():
    rec = normalize_record(_rec(subject_id="11"))
    assert rec.subject_id == "s11"
    assert any("subject" in f.lower() for f in rec.flags)


def test_unknown_task_is_flagged_not_blocked():
    rec = normalize_record(_rec(task="mystery_task__fmri"))
    assert rec.task == "mystery_task__fmri"  # unchanged
    assert any("task" in f.lower() for f in rec.flags)


def test_legit_session_variants_pass_clean():
    for ses in ["1", "prescan3", "pretouch", "anat", "4makeup", "prescan4makeup"]:
        rec = normalize_record(_rec(session=ses))
        assert not any("session" in f.lower() for f in rec.flags), ses


def test_unexpected_session_is_flagged():
    rec = normalize_record(_rec(session="weirdo"))
    assert any("session" in f.lower() for f in rec.flags)
