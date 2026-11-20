import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

test('Chinese leading is rooted at html, not assigned to MathJax descendants', async () => {
  const css = await readFile(new URL('../src/styles/typography.css', import.meta.url), 'utf8')
  const selectors = [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/[^{}]+\{/g)].map(([rule]) => rule.trim())
  const localized = selectors.filter(selector => selector.includes(':lang('))
  assert.ok(localized.length > 0)
  for (const selector of localized) {
    assert.match(selector, /^html:lang\(zh\)/)
  }
  assert.match(css, /html:lang\(zh\)\s*\{\s*--mq-prose-line-height: 1\.75;\s*line-height: 1\.75;/)
  assert.match(css, /line-height: var\(--mq-prose-line-height\)/)
  const docs = await readFile(new URL('../src/layouts/DocsLayout.astro', import.meta.url), 'utf8')
  assert.match(docs, /line-height: var\(--mq-prose-line-height, 1\.7\)/)
})

test('Astro and every Sphinx renderer consume the canonical typography', async () => {
  const read = path => readFile(new URL(path, import.meta.url), 'utf8')
  assert.match(await read('../src/layouts/BaseLayout.astro'), /import "\.\.\/styles\/typography\.css"/)
  assert.match(await read('../scripts/prepare-tokens.mjs'), /\['typography.css', 'mq-typography.css'\]/)
  for (const path of ['../docs/en/_config.yml', '../docs/zh/_config.yml', '../docs/api-en/conf.py', '../docs/api-zh/conf.py', '../courses/_config.yml']) {
    assert.match(await read(path), /mq-typography.css/)
  }
})

test('Sphinx inline identifiers wrap without changing preformatted code', async () => {
  const css = await readFile(new URL('../docs/_static/mq-theme.css', import.meta.url), 'utf8')
  assert.match(css, /\.bd-article :not\(pre\) > code \.pre, \.bd-article \.sig \.pre \{ white-space: normal; \}/)
  assert.match(css, /\.bd-article :not\(pre\) > code, \.bd-article \.sig \{ overflow-wrap: anywhere; \}/)
})

test('display math scrolls at the Sphinx block, not the MathJax glyph box or inline math', async () => {
  const layout = await readFile(new URL('../src/layouts/DocsLayout.astro', import.meta.url), 'utf8')
  const rules = [...layout.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  const overflowRules = rules.filter(([, , declarations]) => /overflow(?:-[xy])?\s*:/.test(declarations))
  const mathRules = overflowRules.filter(([, selectors]) => selectors.includes('.math'))
  assert.equal(mathRules.length, 1)
  assert.ok(mathRules[0][1].split(',').map(selector => selector.trim()).includes('.docs-main div.math'))
  assert.match(mathRules[0][2], /overflow-x:\s*auto/)
  assert.match(mathRules[0][2], /max-width:\s*100%/)
  assert.ok(overflowRules.every(([, selectors]) => !selectors.includes('mjx-')))
})
