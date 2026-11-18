import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parse } from 'node-html-parser'
import { resolveDocLink } from '../src/lib/docs/paths.ts'
import { translationSlug } from '../src/lib/docs/navigation.ts'
import { extractSphinxAssets, normalizeSphinxHtml } from '../scripts/sphinx-assets.mjs'

test('only relative documentation URLs are resolved', () => {
  for (const href of ['data:image/png;base64,abc', 'blob:https://example.org/id', 'urn:isbn:123', 'web+demo:value', 'https://example.org/x', '//example.org/x', 'mailto:a@b.org', 'tel:123', '/images/a.png']) {
    assert.deepEqual(resolveDocLink(href, 'src/beginner/page.html'), { kind: 'external', href })
  }
  assert.deepEqual(resolveDocLink('../other.html#heading', 'src/beginner/page.html'), { kind: 'slug', slug: 'src/other', hash: '#heading' })
  assert.deepEqual(resolveDocLink('../../_images/plot.png', 'src/beginner/page.html'), { kind: 'asset', assetPath: '_images/plot.png', hash: '' })
  assert.deepEqual(resolveDocLink('', 'index.html'), { kind: 'fragment', href: '' })
  assert.deepEqual(resolveDocLink('#anchor', 'index.html'), { kind: 'fragment', href: '#anchor' })
})

test('translation navigation uses the built content set and nearest section', () => {
  const available = new Set(['', 'src/case_library/case_library', 'src/beginner/index', 'src/beginner/bloch_sphere'])
  assert.equal(translationSlug('src/beginner/bloch_sphere', available), 'src/beginner/bloch_sphere')
  assert.equal(translationSlug('src/case_library/untranslated', available), 'src/case_library/case_library')
  assert.equal(translationSlug('src/beginner/missing', available), 'src/beginner/index')
  assert.equal(translationSlug('src/unknown/nested/page', available), '')
  assert.equal(translationSlug('', available), '')
  assert.throws(() => translationSlug('missing', new Set()), /no root page/)
})

test('article assets are derived in source order, without theme chrome or async races', () => {
  const doc = parse(`<head>
    <link rel="stylesheet" href="../../_static/styles/theme.css">
    <link rel="stylesheet" href="../../_static/mystnb.currenthash.css?v=1">
    <script src="../../_static/scripts/sphinx-book-theme.js"></script>
    <script src="../../_static/documentation_options.js?v=2"></script>
    <script>const THEBE_JS_URL = 'runtime';</script>
    <script async src="../../_static/sphinx-thebe.js"></script>
    <script>const THEBE_JS_URL = 'runtime';</script>
    <script>window.MathJax = {options: {}};</script>
    <script defer src="../../_static/mathjax/tex-mml-chtml.js"></script>
  </head>`)
  const assets = extractSphinxAssets(doc, 'src/beginner/page.html', '/project/docs/en/')
  assert.equal(assets.length, 6)
  assert.equal(assets[0].attributes.href, '/project/docs/en/_static/mystnb.currenthash.css?v=1')
  assert.equal(assets[1].attributes.src, '/project/docs/en/_static/documentation_options.js?v=2')
  assert.match(assets[2].content, /THEBE_JS_URL/)
  assert.equal(assets[3].attributes.src, '/project/docs/en/_static/sphinx-thebe.js')
  assert.match(assets[4].content, /MathJax/)
  assert.equal(assets[5].attributes.src, '/project/docs/en/_static/mathjax/tex-mml-chtml.js')
  assert.ok(assets.every(a => !('async' in a.attributes) && !('defer' in a.attributes)))
  assert.deepEqual(extractSphinxAssets(parse('<head></head>'), 'index.html', '/docs/en/'), [])
  assert.throws(() => extractSphinxAssets(parse('<article></article>'), 'index.html', '/docs/en/'), /Missing Sphinx head/)
})

test('publishing emits each identical script once, preserving distinct configurations', () => {
  const html = '<head><script>const A=1;</script><script src="a.js" async></script><script>const A=1;</script><script src="a.js" async></script><script>const B=2;</script></head><body><pre>&lt;example&gt;</pre><script>render();</script><script>render();</script></body>'
  const normalized = normalizeSphinxHtml(html)
  assert.equal(parse(normalized).querySelectorAll('head script').length, 3)
  assert.equal(parse(normalized).querySelectorAll('body script').length, 2)
  assert.equal(parse(normalized).querySelector('pre').innerHTML, '&lt;example&gt;')
  assert.equal(normalizeSphinxHtml(normalized), normalized)
  assert.equal(normalizeSphinxHtml(''), '')
})
