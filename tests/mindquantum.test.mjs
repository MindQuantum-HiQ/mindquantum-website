import assert from 'node:assert/strict'
import { test } from 'node:test'
import { MINDQUANTUM, INSTALL_COMMAND, PYTHON_REQUIREMENT, STABLE_SERIES } from '../src/config/mindquantum.ts'
import { DOCUMENTATION_MESSAGES } from '../src/locales/documentation.ts'
import { HOME_MESSAGES } from '../src/locales/home.ts'

test('install guidance derives from the supported MindQuantum release', () => {
  assert.equal(INSTALL_COMMAND, `pip install ${MINDQUANTUM.packageName}==${MINDQUANTUM.version}`)
  assert.equal(PYTHON_REQUIREMENT, `Python ${MINDQUANTUM.python.min}–${MINDQUANTUM.python.max}`)
  assert.equal(STABLE_SERIES, '0.12')
  for (const lang of ['en', 'zh']) {
    assert.equal(DOCUMENTATION_MESSAGES[lang].install.command, INSTALL_COMMAND)
    assert.ok(DOCUMENTATION_MESSAGES[lang].install.meta.includes(PYTHON_REQUIREMENT))
    assert.ok(DOCUMENTATION_MESSAGES[lang].install.meta.includes(STABLE_SERIES))
    assert.equal(HOME_MESSAGES[lang].framework.installCmd, INSTALL_COMMAND)
    assert.equal(HOME_MESSAGES[lang].framework.pythonRequirement, PYTHON_REQUIREMENT)
  }
})
