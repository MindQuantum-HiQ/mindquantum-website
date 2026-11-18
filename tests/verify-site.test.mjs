import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { resolveInternalLink, verifyHtml, verifySite } from '../scripts/verify-site.mjs'

test('internal links resolve relative to the page and deployment base', () => {
  const files = new Set(['index.html', 'docs/index.html', 'a b.png'])
  for (const href of ['/project/docs/?q=1#heading', './?q=1', 'index.html', '#heading', '']) {
    assert.equal(resolveInternalLink(href, 'docs/index.html', files, '/project/'), 'docs/index.html')
  }
  assert.equal(resolveInternalLink('../a%20b.png', 'docs/index.html', files, '/project/'), 'a b.png')
  assert.equal(resolveInternalLink('/', 'index.html', files), 'index.html')
  assert.equal(resolveInternalLink('https://example.org/project/docs/', 'index.html', files, '/project/', 'https://example.org/project'), 'docs/index.html')
  assert.throws(() => resolveInternalLink('/docs/', 'index.html', files, '/project/'), /outside ASTRO_BASE/)
  assert.throws(() => resolveInternalLink('missing', 'index.html', files), /missing/)
  assert.throws(() => resolveInternalLink('%zz', 'index.html', files), /URI/)
})

test('external URLs are ignored without network access', () => {
  for (const href of ['https://other.org/x', '//other.org/x', 'mailto:a@b.org', 'data:image/png;base64,x', 'javascript:void(0)', 'tel:123']) {
    assert.equal(resolveInternalLink(href, 'index.html', new Set()), null)
  }
})

test('HTML verification lists all broken href and src attributes', () => {
  assert.deepEqual(verifyHtml('', 'index.html', new Set()), [])
  const errors = verifyHtml('<a href="missing">x</a><img src="broken.png"><a href="#ok">ok</a>', 'index.html', new Set(['index.html']))
  assert.equal(errors.length, 2)
  assert.match(errors[0], /href="missing"/)
  assert.match(errors[1], /src="broken.png"/)
})

test('site verification requires key pages and their markers, even in an empty site', async () => {
  const root = await mkdtemp(join(tmpdir(), 'verify-site-'))
  try {
    const pages = [['docs/index.html', 'Expected']]
    assert.deepEqual((await verifySite(root, { pages })).errors, ['key page missing: docs/index.html'])
    await mkdir(join(root, 'docs'))
    await writeFile(join(root, 'docs/index.html'), '<p>Wrong</p>')
    assert.match((await verifySite(root, { pages })).errors[0], /missing marker/)
    await writeFile(join(root, 'docs/index.html'), '<p>Expected</p>')
    assert.deepEqual(await verifySite(root, { pages }), { errors: [], count: 1, keyCount: 1 })
  } finally {
    await rm(root, { recursive: true })
  }
})
