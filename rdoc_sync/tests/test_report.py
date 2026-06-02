from rdoc_sync.report import write_report


def test_write_report_lists_only_flagged(tmp_path):
    rows = [
        {"source_filename": "a.json", "flags": ["subject id normalized '11' -> 's11'"]},
        {"source_filename": "b.json", "flags": []},
        {"source_filename": "c.json", "flags": ["unknown task 'x'"]},
    ]
    out = tmp_path / "report.md"
    n = write_report(rows, out)
    assert n == 2
    text = out.read_text()
    assert "a.json" in text and "c.json" in text
    assert "b.json" not in text


def test_write_report_clean_corpus(tmp_path):
    out = tmp_path / "report.md"
    n = write_report([{"source_filename": "a.json", "flags": []}], out)
    assert n == 0
    assert "No anomalies" in out.read_text()
