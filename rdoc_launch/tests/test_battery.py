from pathlib import Path
from rdoc_launch.battery import write_battery


def test_write_battery_reverses_for_serving_order(tmp_path):
    out = tmp_path / "battery.txt"
    write_battery(["ax_cpt_rdoc__fmri", "flanker_rdoc__fmri", "stroop_rdoc__fmri"],
                  out, exp_root=Path("/repo"))
    lines = out.read_text().splitlines()
    # module serves/pops from the END, so file is reversed -> first task last
    assert lines == ["/repo/stroop_rdoc__fmri", "/repo/flanker_rdoc__fmri", "/repo/ax_cpt_rdoc__fmri"]
