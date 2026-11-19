import { parse } from 'node-html-parser'

export function uniqueScripts(root) {
  const seen = new Set()
  let changed = false
  for (const script of root.querySelectorAll('script')) {
    const key = JSON.stringify([
      Object.entries(script.attributes).sort(([a], [b]) => a.localeCompare(b)),
      script.innerHTML.trim(),
    ])
    if (seen.has(key)) {
      script.remove()
      changed = true
    }
    else seen.add(key)
  }
  return changed
}

export function normalizeSphinxHtml(html) {
  const doc = parse(html, { blockTextElements: { script: true, style: true, pre: true, code: true } })
  const head = doc.querySelector('head')
  const scriptsChanged = head ? uniqueScripts(head) : false
  const actionsChanged = normalizeArticleActions(doc)
  const iconsChanged = normalizeThemeIcons(doc)
  return scriptsChanged || actionsChanged || iconsChanged ? doc.toString() : html
}

// Keep Sphinx's toolbar behavior/data attributes, but render the same outline
// glyphs as Astro and the shared controls instead of a second icon language.
const THEME_ICONS = new Map([
  ['fa-magnifying-glass', 'search'], ['fa-download', 'download'],
  ['fa-file', 'file'], ['fa-file-pdf', 'file-text'], ['fa-expand', 'expand'],
  ['fa-sun', 'sun'], ['fa-moon', 'moon'], ['fa-circle-half-stroke', 'monitor'],
  ['fa-angle-left', 'chevron-left'], ['fa-angle-right', 'chevron-right'],
  ['fa-arrow-up', 'arrow-up'],
])

function normalizeThemeIcons(doc) {
  let changed = false
  for (const element of doc.querySelectorAll('i')) {
    const classes = (element.getAttribute('class') || '').split(/\s+/)
    const icon = classes.map(cls => THEME_ICONS.get(cls)).find(Boolean)
    if (!icon) continue
    for (const cls of classes) {
      if (cls === 'fa' || cls === 'fas' || cls === 'far' || cls.startsWith('fa-')) element.classList.remove(cls)
    }
    element.set_content(`<span class="mq-icon mq-icon-${icon}" aria-hidden="true"></span>`)
    changed = true
  }
  return changed
}

// Imported upstream badge artwork is content metadata, not our control UI.
// Adapt only the known image-only source/download links, preserving both href
// and localized accessible label. Never rewrite notebook figures or outputs.
function normalizeArticleActions(doc) {
  let changed = false
  for (const image of doc.querySelectorAll('article.bd-article a > img')) {
    const match = /\/logo_(notebook|download_code|source)(?:_(?:en|cn|zh))?\.svg(?:\?.*)?$/.exec(image.getAttribute('src') || '')
    if (!match || !image.getAttribute('alt')) continue
    const link = image.parentNode
    if (link.childNodes.length !== 1) continue
    const icon = { notebook: 'download', download_code: 'code', source: 'external' }[match[1]]
    const label = image.getAttribute('alt').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    for (const cls of ['mq-btn', 'mq-btn-outline', 'mq-btn-compact']) link.classList.add(cls)
    link.set_content(`<span class="mq-icon mq-icon-${icon}" aria-hidden="true"></span><span>${label}</span>`)
    if (link.parentNode.tagName === 'P') link.parentNode.classList.add('mq-article-actions')
    changed = true
  }
  for (const paragraph of doc.querySelectorAll('p.mq-article-actions')) {
    if (paragraph.parentNode.classList.contains('mq-article-tools')) continue
    if (!paragraph.childNodes.every(node => node.nodeType === 3
      ? !node.rawText.trim()
      : node.tagName === 'A' && node.classList.contains('mq-btn'))) continue
    const isEnglish = doc.querySelector('html')?.getAttribute('lang')?.startsWith('en')
    const tools = parse(`<details class="mq-article-tools"><summary>${isEnglish ? 'Downloads &amp; source' : '下载与源文件'}</summary></details>`).firstChild
    paragraph.replaceWith(tools)
    tools.appendChild(paragraph)
    changed = true
  }
  return changed
}

// Astro owns the shell; Sphinx remains the source of article extension assets
// and their configuration. Theme chrome and search belong to the original shell.
export function extractSphinxAssets(doc, sourcePath, langRoot) {
  const head = doc.querySelector('head')
  if (!head) throw new Error(`Missing Sphinx head: ${sourcePath}`)
  uniqueScripts(head)
  const assets = []
  const sourceUrl = new URL(sourcePath, 'https://sphinx.invalid/')
  for (const element of head.querySelectorAll('link[rel="stylesheet"], script')) {
    const isScript = element.tagName === 'SCRIPT'
    const raw = element.getAttribute(isScript ? 'src' : 'href')
    if (!raw) {
      if (isScript && !element.hasAttribute('data-cfasync')) {
        assets.push({ tag: 'script', attributes: {}, content: element.innerHTML })
      }
      continue
    }
    const url = new URL(raw, sourceUrl)
    const local = url.origin === sourceUrl.origin
    // Astro already imports these exact sources; avoid duplicate global CSS.
    if (local && /\/_static\/mq-(fonts|variables|controls|typography)\.css$/.test(url.pathname)) continue
    if (local && (/\/_static\/(styles|scripts)\//.test(url.pathname) ||
      /\/(searchtools|language_data|searchindex)\.js$/.test(url.pathname))) continue
    const href = local ? `${langRoot}${url.pathname.slice(1)}${url.search}${url.hash}` : url.href
    const attributes = { ...element.attributes }
    delete attributes.async
    delete attributes.defer
    attributes[isScript ? 'src' : 'href'] = href
    assets.push({ tag: isScript ? 'script' : 'link', attributes, content: '' })
  }
  return assets
}
