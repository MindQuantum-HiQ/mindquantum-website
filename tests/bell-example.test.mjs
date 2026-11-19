import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { bellExample } from '../src/lib/bell-example.ts'
import { MINDQUANTUM } from '../src/config/mindquantum.ts'

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-12, `${actual} != ${expected}`)

test('homepage executes the displayed source with the supported MindQuantum release', () => {
  assert.equal(bellExample.code, readFileSync(new URL('../src/lib/bell-state.py', import.meta.url), 'utf8'))
  assert.equal(bellExample.version, MINDQUANTUM.version)
  assert.equal(bellExample.nQubits, 2)
  assert.deepEqual(bellExample.gates, [
    { name: 'H', targets: [0], controls: [] },
    { name: 'X', targets: [1], controls: [0] },
  ])
})

test('circuit prefixes distinguish superposition from Bell-state correlation', () => {
  const expected = [[1, 0, 0, 0], [0.5, 0.5, 0, 0], [0.5, 0, 0, 0.5]]
  assert.equal(bellExample.stages.length, expected.length)
  bellExample.stages.forEach((stage, i) => {
    assert.equal(stage.length, 4)
    stage.forEach((p, basis) => close(p, expected[i][basis]))
    close(stage.reduce((sum, p) => sum + p, 0), 1)
  })
  assert.deepEqual(bellExample.probabilities, bellExample.stages.at(-1))
})
