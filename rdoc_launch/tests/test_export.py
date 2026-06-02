import json
from rdoc_launch.export import build_counterbalancing, export_counterbalancing


def test_build_counterbalancing_parses_array_cells():
    records = [
        {"subject_id": "s4", "ses-01": "[['stroop', 1, True], ['flanker', 1, True]]", "ses-02": ""},
        {"subject_id": "s11", "ses-01": "[['axCPT', 1, True]]"},
        {"subject_id": "", "ses-01": "[['ignored', 1, True]]"},  # no subject -> skipped
    ]
    cb = build_counterbalancing(records)
    assert cb["s4"]["ses-01"] == [["stroop", 1, True], ["flanker", 1, True]]
    assert "ses-02" not in cb["s4"]  # empty cell omitted
    assert cb["s11"]["ses-01"] == [["axCPT", 1, True]]
    assert "" not in cb


def test_export_counterbalancing_writes_json(tmp_path):
    records = [{"subject_id": "s4", "ses-01": "[['stroop', 1, True]]"}]

    class _FakeWS:
        def get_all_records(self):
            return records

    class _FakeSS:
        def worksheet(self, name):
            return _FakeWS()

    class _FakeClient:
        def open(self, name):
            return _FakeSS()

    out = tmp_path / "counterbalancing.json"
    n = export_counterbalancing(lambda: _FakeClient(), out, "SHEET", "WS")
    assert n == 1
    data = json.loads(out.read_text())
    assert data["s4"]["ses-01"] == [["stroop", 1, True]]
