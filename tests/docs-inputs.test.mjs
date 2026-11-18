import assert from 'node:assert/strict'
import { test } from 'node:test'
import { spawnSync } from 'node:child_process'

test('upstream cache always checks out the pinned SHA and fails on unavailable commits', () => {
  const result = spawnSync('python3', ['-c', `
import json
import subprocess
import tempfile
from pathlib import Path
from scripts import upstream_utils as upstream

def git(path, *args):
    return subprocess.check_output(['git', '-C', str(path), *args], stderr=subprocess.DEVNULL).decode().strip()

with tempfile.TemporaryDirectory() as temp:
    root = Path(temp)
    origin = root / 'origin'
    origin.mkdir()
    git(origin, 'init')
    for message in ('first', 'second'):
        git(origin, '-c', 'user.name=Test', '-c', 'user.email=test@example.org', 'commit', '--allow-empty', '-m', message)
    first = git(origin, 'rev-parse', 'HEAD~1')
    second = git(origin, 'rev-parse', 'HEAD')
    upstream.ROOT = root
    upstream.CFG_PATH = root / 'upstreams.json'
    def config(ref):
        upstream.CFG_PATH.write_text(json.dumps({'baseDir': 'cache', 'repos': {'test': {'url': str(origin), 'ref': ref}}}))
    config(first)
    cached = upstream.ensure_repo('test')
    assert git(cached, 'rev-parse', 'HEAD') == first
    config(second)
    upstream.ensure_repo('test')
    assert git(cached, 'rev-parse', 'HEAD') == second
    config(first)
    upstream.ensure_repo('test')
    assert git(cached, 'rev-parse', 'HEAD') == first
    config('0' * 40)
    try:
        upstream.ensure_repo('test')
    except subprocess.CalledProcessError:
        pass
    else:
        raise AssertionError('missing commit must fail')
    config('master')
    try:
        upstream.ensure_repo('test')
    except ValueError:
        pass
    else:
        raise AssertionError('branch refs must fail')
    upstream.CFG_PATH.write_text('')
    try:
        upstream.ensure_repo('test')
    except json.JSONDecodeError:
        pass
    else:
        raise AssertionError('empty configuration must fail')
`], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stdout + result.stderr)
})

test('API tiles honor ASTRO_BASE during source normalization', () => {
  const result = spawnSync('python3', ['-c', `
import os
from scripts.normalize_book_sources import fix_api_tile_href
for base in ('/', '/project/'):
    os.environ['ASTRO_BASE'] = base
    assert fix_api_tile_href('<a href="overview.html">API</a>', 'en') == f'<a href="{base}api/en/" target="_top">API</a>'
`], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stdout + result.stderr)
})
