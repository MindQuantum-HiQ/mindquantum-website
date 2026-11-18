#!/usr/bin/env python3
"""Materialize the exact upstream revisions recorded in upstreams.json."""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CFG_PATH = ROOT / 'scripts' / 'upstreams.json'


def _load_config():
    return json.loads(CFG_PATH.read_text(encoding='utf-8'))


def _run_git(args: list[str], cwd: Path):
    return subprocess.run(['git', *args], cwd=cwd, check=True)


def ensure_repo(name: str, update: bool = False) -> Path:
    cfg = _load_config()
    info = cfg['repos'][name]
    ref = info['ref']
    if len(ref) != 40 or any(c not in '0123456789abcdef' for c in ref):
        raise ValueError(f'{name}: ref must be a full commit SHA')
    dest = ROOT / cfg['baseDir'] / name
    if not (dest / '.git').exists():
        dest.mkdir(parents=True, exist_ok=True)
        _run_git(['init'], dest)
        _run_git(['remote', 'add', 'origin', info['url']], dest)
    present = subprocess.run(['git', 'cat-file', '-e', f'{ref}^{{commit}}'],
                             cwd=dest, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if update or present.returncode != 0:
        _run_git(['fetch', '--depth', '1', 'origin', ref], dest)
    _run_git(['checkout', '--detach', ref], dest)
    print(f'[upstreams] {name}: {ref}')
    return dest


def ensure_all(update: bool = False) -> dict[str, Path]:
    return {name: ensure_repo(name, update) for name in _load_config()['repos']}


if __name__ == '__main__':
    ensure_all()
