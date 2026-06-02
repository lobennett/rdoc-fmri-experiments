import pytest
from rdoc_sync.config import load_settings, Settings


def test_load_settings_from_env_file(tmp_path):
    env = tmp_path / ".env"
    env.write_text(
        "SUPABASE_URL=https://x.supabase.co\n"
        "SUPABASE_KEY=secret\n"
        "DROPBOX_REMOTE=remote:base\n"
    )
    s = load_settings(env_path=env)
    assert s == Settings(supabase_url="https://x.supabase.co",
                         supabase_key="secret", dropbox_remote="remote:base")


def test_load_settings_missing_var_raises(tmp_path):
    env = tmp_path / ".env"
    env.write_text("SUPABASE_URL=https://x.supabase.co\n")
    with pytest.raises(ValueError, match="SUPABASE_KEY"):
        load_settings(env_path=env)
