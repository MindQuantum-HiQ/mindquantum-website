import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

test('Chinese leading is rooted at html, not assigned to MathJax descendants', async () => {
  const css = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8')
  const selectors = [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/[^{}]+\{/g)].map(([rule]) => rule.trim())
  const localized = selectors.filter(selector => selector.includes(':lang('))
  assert.ok(localized.length > 0)
  for (const selector of localized) {
    for (const part of selector.slice(0, -1).split(',')) {
      assert.match(part.trim(), /^html:lang\(zh\)/)
    }
  }
  assert.match(css, /html:lang\(zh\)\s*\{\s*--mq-prose-line-height: 1\.75;\s*line-height: 1\.75;/)
  assert.match(css, /line-height: var\(--mq-prose-line-height, 1\.6\)/)
  const docs = await readFile(new URL('../src/layouts/DocsLayout.astro', import.meta.url), 'utf8')
  assert.match(docs, /line-height: var\(--mq-prose-line-height, 1\.7\)/)
})
