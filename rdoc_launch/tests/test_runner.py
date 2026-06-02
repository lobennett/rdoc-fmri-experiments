from rdoc_launch.runner import build_server_cmd, detect_port, build_chrome_cmd


def test_build_server_cmd():
    cmd = build_server_cmd("/repo/.battery.txt", "s11", "prescan3", "/repo/.output/raw", "/repo/.output/bids")
    assert cmd == ["expfactory_deploy_local", "-c", "/repo/.battery.txt",
                   "-raw", "/repo/.output/raw", "-bids", "/repo/.output/bids",
                   "-sub", "s11", "-ses", "prescan3", "-run", "1"]


def test_detect_port_parses_startup_line():
    assert detect_port("Starting server on port 8083") == 8083
    assert detect_port("some other line") is None


def test_build_chrome_cmd_includes_throttle_flag():
    cmd = build_chrome_cmd(8083, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                           ["--disable-background-timer-throttling", "--new-window"])
    assert cmd[0].endswith("Google Chrome")
    assert cmd[1] == "http://localhost:8083"
    assert "--disable-background-timer-throttling" in cmd
