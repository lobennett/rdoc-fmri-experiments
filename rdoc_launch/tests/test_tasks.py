import pytest
from rdoc_launch.tasks import full_task_name, experiment_dir


def test_full_task_name_maps_abbreviations():
    assert full_task_name("spatialTS") == "spatial_task_switching"
    assert full_task_name("cuedTS") == "cued_task_switching"
    assert full_task_name("nBack") == "n_back"
    assert full_task_name("stroop") == "stroop"


def test_full_task_name_unknown_raises():
    with pytest.raises(ValueError, match="mystery"):
        full_task_name("mystery")


def test_experiment_dir_practice_and_real():
    assert experiment_dir("stroop", is_practice=False) == "stroop_rdoc__fmri"
    assert experiment_dir("spatialTS", is_practice=True) == "spatial_task_switching_rdoc_practice__fmri"
