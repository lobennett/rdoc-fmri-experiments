"""Build commands for the local server + Chrome, and start the server detecting its port."""
from __future__ import annotations

import re
import subprocess
from dataclasses import dataclass
from typing import Optional

_PORT_RE = re.compile(r"Starting server on port (\d+)")


def build_server_cmd(battery_path: str, subject: str, label: str,
                     raw_dir: str, bids_dir: str) -> list[str]:
    return ["expfactory_deploy_local", "-c", str(battery_path),
            "-raw", str(raw_dir), "-bids", str(bids_dir),
            "-sub", subject, "-ses", label, "-run", "1"]


def detect_port(line: str) -> Optional[int]:
    m = _PORT_RE.search(line)
    return int(m.group(1)) if m else None


def build_chrome_cmd(port: int, chrome_path: str, flags: list[str]) -> list[str]:
    return [chrome_path, f"http://localhost:{port}", *flags]


@dataclass
class ServerHandle:
    port: int
    proc: object

    def stop(self) -> None:
        try:
            self.proc.terminate()
        except Exception:
            pass


def start_server(cmd: list[str], cwd: str, popen=subprocess.Popen) -> ServerHandle:
    """Start the server and block until it prints its bound port."""
    proc = popen(cmd, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    for line in proc.stdout:  # read until the port line appears
        print(line, end="")
        port = detect_port(line)
        if port is not None:
            return ServerHandle(port=port, proc=proc)
    raise RuntimeError("Server exited before reporting a port")
