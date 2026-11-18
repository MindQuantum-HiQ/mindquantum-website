import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildAndRun } from '../src/lib/sim/adapter.ts'
import { createRotationPlacement, serializeCircuit } from '../src/lib/circuit/model.ts'

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-12, `${actual} != ${expected}`)
const circuit = (gates, nQubits = 1) => ({
  nQubits,
  columns: gates.map(g => ({ items: Array.from({ length: nQubits }, (_, q) => g.targets.includes(q) ? g : null) })),
})
const rotation = (type, angle, target = 0) => createRotationPlacement(type, [target], 'rotation', angle)

for (const type of ['RX', 'RY', 'RZ']) {
  test(`${type}(0) preserves |0> through serialization`, async () => {
    const result = await buildAndRun(serializeCircuit(circuit([rotation(type, 0)])))
    assert.equal(result.error, undefined)
    close(result.probs[0], 1)
    close(result.probs[1], 0)
  })
}

for (const type of ['RX', 'RY']) {
  for (const [angle, expected] of [[Math.PI, [0, 1]], [Math.PI / 2, [0.5, 0.5]]]) {
    test(`${type}(${angle}) has expected probabilities`, async () => {
      const result = await buildAndRun(circuit([rotation(type, angle)]))
      assert.equal(result.error, undefined)
      result.probs.forEach((p, i) => close(p, expected[i]))
    })
  }
}

test('RZ on H|0> applies the expected relative phase', async () => {
  const angle = Math.PI / 3
  const result = await buildAndRun(circuit([{ type: 'H', targets: [0], id: 'h' }, rotation('RZ', angle)]))
  assert.equal(result.error, undefined)
  close(result.statevector.re[0], Math.cos(angle / 2) * Math.SQRT1_2)
  close(result.statevector.im[0], -Math.sin(angle / 2) * Math.SQRT1_2)
  close(result.statevector.re[1], Math.cos(angle / 2) * Math.SQRT1_2)
  close(result.statevector.im[1], Math.sin(angle / 2) * Math.SQRT1_2)
})

test('two-qubit rotations respect quantum-circuit little-endian ordering', async () => {
  for (const [target, expectedIndex] of [[0, 1], [1, 2]]) {
    const result = await buildAndRun(circuit([rotation('RX', 0, target)], 2))
    assert.equal(result.error, undefined)
    result.probs.forEach((p, i) => close(p, i === 0 ? 1 : 0))
    const flipped = await buildAndRun(circuit([rotation('RY', Math.PI, target)], 2))
    assert.equal(flipped.error, undefined)
    flipped.probs.forEach((p, i) => close(p, i === expectedIndex ? 1 : 0))
  }
})

test('empty circuit remains in |0>', async () => {
  const result = await buildAndRun(circuit([]))
  assert.equal(result.error, undefined)
  close(result.probs[0], 1)
  close(result.probs[1], 0)
})

for (const [type, param] of [['RX', 'theta'], ['RY', 'theta'], ['RZ', 'phi']]) {
  test(`${type} rejects missing and non-finite angles`, async () => {
    for (const params of [undefined, {}, { [param]: NaN }, { [param]: Infinity }, { [param]: -Infinity }, { [param]: '0' }]) {
      const invalid = circuit([{ type, targets: [0], id: 'invalid', params }])
      const result = await buildAndRun(invalid)
      assert.deepEqual(result.error, { code: 'sim_error', message: `${type} requires a finite numeric '${param}' angle` })
      assert.equal(result.statevector, undefined)
      assert.throws(() => serializeCircuit(invalid), /requires a finite numeric/)
    }
    assert.throws(() => rotation(type, Infinity), /requires a finite numeric/)
  })
}
