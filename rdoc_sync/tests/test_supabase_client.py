from rdoc_sync.supabase_client import upsert_run, ON_CONFLICT


class _FakeExec:
    def execute(self):
        return {"ok": True}


class _FakeTable:
    def __init__(self, recorder):
        self.recorder = recorder

    def upsert(self, payload, on_conflict=None):
        self.recorder["payload"] = payload
        self.recorder["on_conflict"] = on_conflict
        return _FakeExec()


class _FakeClient:
    def __init__(self):
        self.recorder = {}

    def table(self, name):
        self.recorder["table"] = name
        return _FakeTable(self.recorder)


def test_upsert_run_calls_table_with_on_conflict():
    client = _FakeClient()
    upsert_run(client, {"subject_id": "s11"})
    assert client.recorder["table"] == "runs"
    assert client.recorder["payload"] == {"subject_id": "s11"}
    assert client.recorder["on_conflict"] == ON_CONFLICT == "subject_id,session,run,task,date_time"
