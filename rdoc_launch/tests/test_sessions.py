import pytest
from rdoc_launch.sessions import resolve_session, session_menu, SessionPlan


def test_regular_session():
    assert resolve_session("3") == SessionPlan(cb_column="ses-03", is_practice=False, label="3")


def test_prescan_session():
    assert resolve_session("prescan3") == SessionPlan(cb_column="ses-03", is_practice=True, label="prescan3")


def test_pretouch_and_anatomical():
    assert resolve_session("pretouch") == SessionPlan(cb_column="ses-01", is_practice=True, label="pretouch")
    assert resolve_session("00") == SessionPlan(cb_column="ses-02", is_practice=True, label="00")


def test_makeup_variants():
    assert resolve_session("4makeup") == SessionPlan(cb_column="ses-04", is_practice=False, label="4makeup")
    assert resolve_session("prescan4makeup") == SessionPlan(cb_column="ses-04", is_practice=True, label="prescan4makeup")


def test_invalid_session_raises():
    with pytest.raises(ValueError):
        resolve_session("pretouch1")
    with pytest.raises(ValueError):
        resolve_session("11")


def test_menu_contains_expected_entries():
    menu = session_menu()
    for expected in ["1", "10", "prescan1", "prescan10", "pretouch", "00", "4makeup", "prescan4makeup"]:
        assert expected in menu
    assert "pretouch1" not in menu and "11" not in menu
