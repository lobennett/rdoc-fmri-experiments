import pytest
from rdoc_launch.validate import validate_subject

CB = {"s4": {}, "s11": {}}


def test_valid_subject_passes():
    assert validate_subject("s11", CB) == "s11"


def test_numeric_subject_rejected():
    with pytest.raises(ValueError, match="sNN"):
        validate_subject("11", CB)


def test_sub_prefixed_rejected():
    with pytest.raises(ValueError, match="sNN"):
        validate_subject("sub-11", CB)


def test_absent_subject_rejected():
    with pytest.raises(ValueError, match="not in counterbalancing"):
        validate_subject("s99", CB)
