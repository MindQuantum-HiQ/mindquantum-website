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
  return head && uniqueScripts(head) ? doc.toString() : html
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
