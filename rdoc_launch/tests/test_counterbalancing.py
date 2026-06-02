import json
import pytest
from rdoc_launch.counterbalancing import load_counterbalancing, resolve_battery
from rdoc_launch.sessions import SessionPlan


def test_load_counterbalancing(tmp_path):
    p = tmp_path / "cb.json"
    p.write_text(json.dumps({"s4": {"ses-03": [["stroop", 1, False]]}}))
    cb = load_counterbalancing(p)
    assert cb["s4"]["ses-03"][0][0] == "stroop"


def test_resolve_battery_real_order_preserved():
    cb = {"s4": {"ses-03": [["axCPT", 1, False], ["flanker", 1, False], ["stroop", 1, False]]}}
    plan = SessionPlan(cb_column="ses-03", is_practice=False, label="3")
    battery = resolve_battery(cb, "s4", plan)
    assert battery == ["ax_cpt_rdoc__fmri", "flanker_rdoc__fmri", "stroop_rdoc__fmri"]


def test_resolve_battery_practice_versions():
    cb = {"s4": {"ses-03": [["axCPT", 1, True]]}}
    plan = SessionPlan(cb_column="ses-03", is_practice=True, label="prescan3")
    assert resolve_battery(cb, "s4", plan) == ["ax_cpt_rdoc_practice__fmri"]


def test_resolve_battery_missing_column_raises():
    cb = {"s4": {"ses-03": [["stroop", 1, False]]}}
    plan = SessionPlan(cb_column="ses-09", is_practice=False, label="9")
    with pytest.raises(ValueError, match="ses-09"):
        resolve_battery(cb, "s4", plan)
