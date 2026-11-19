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

test('imported source badges become labeled controls without changing links or figures', () => {
  for (const [suffix, label] of [['_en', 'Download Notebook'], ['_cn', '下载 Notebook'], ['_zh', '下载 Notebook'], ['', '下载 Notebook']]) {
    const href = 'https://example.org/tutorial.ipynb'
    const html = `<head></head><article class="bd-article"><p><a href="${href}"><img alt="${label}" src="https://example.org/logo_notebook${suffix}.svg"></a></p><figure><img src="plot.svg" alt="A scientific plot"></figure></article>`
    const normalized = normalizeSphinxHtml(html)
    const root = parse(normalized)
    const link = root.querySelector('.mq-article-actions a')
    assert.ok(root.querySelector('details.mq-article-tools > summary'))
    assert.equal(root.querySelector('details.mq-article-tools').hasAttribute('open'), false)
    assert.equal(link.getAttribute('href'), href)
    assert.equal(link.text.trim(), label)
    assert.ok(link.classList.contains('mq-btn-outline'))
    assert.equal(link.querySelector('.mq-icon').getAttribute('aria-hidden'), 'true')
    assert.equal(root.querySelector('figure img').getAttribute('src'), 'plot.svg')
    assert.equal(normalizeSphinxHtml(normalized), normalized)
  }
})

test('article tools are localized, preserve all source links, and leave mixed prose alone', () => {
  for (const [lang, label] of [['en', 'Downloads & source'], ['zh-CN', '下载与源文件']]) {
    const links = ['notebook', 'download_code', 'source'].map(kind => `<a href="https://example.org/${kind}"><img src="https://example.org/logo_${kind}.svg" alt="${kind}"></a>`).join(' \n')
    const html = `<html lang="${lang}"><article class="bd-article"><h1>Title</h1><p>${links}</p><p>Prose <a href="plot.svg"><img src="plot.svg" alt="Figure"></a></p></article></html>`
    const result = normalizeSphinxHtml(html)
    const root = parse(result)
    const tools = root.querySelector('details.mq-article-tools')
    assert.equal(tools.querySelector('summary').text, label)
    assert.deepEqual(tools.querySelectorAll('a').map(a => a.getAttribute('href')), ['notebook', 'download_code', 'source'].map(kind => `https://example.org/${kind}`))
    assert.equal(root.querySelector('img').getAttribute('src'), 'plot.svg')
    assert.equal(normalizeSphinxHtml(result), result)
  }
  const mixed = '<article class="bd-article"><p>Read this <a href="x"><img src="https://example.org/logo_source.svg" alt="Source"></a> first.</p></article>'
  const root = parse(normalizeSphinxHtml(mixed))
  assert.equal(root.querySelector('details'), null)
  assert.match(root.text, /Read this Source first\./)
})

test('theme icons share outline glyphs while preserving theme-switch behavior', () => {
  const html = '<button aria-label="Color mode"><i class="theme-switch fa-solid fa-sun fa-lg" data-mode="light" title="Light"></i></button><button aria-label="Search"><i class="fa-solid fa-magnifying-glass"></i></button><i class="scientific-notation">x</i>'
  const normalized = normalizeSphinxHtml(html)
  const root = parse(normalized)
  const toggle = root.querySelector('i.theme-switch')
  assert.equal(toggle.getAttribute('data-mode'), 'light')
  assert.equal(toggle.getAttribute('title'), 'Light')
  assert.ok(toggle.querySelector('.mq-icon-sun'))
  assert.equal(root.querySelector('[aria-label="Search"] .mq-icon-search').getAttribute('aria-hidden'), 'true')
  assert.equal(root.querySelector('.scientific-notation').text, 'x')
  assert.equal(normalizeSphinxHtml(normalized), normalized)
})
