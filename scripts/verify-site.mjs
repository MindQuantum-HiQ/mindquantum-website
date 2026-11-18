import { readdir, readFile } from 'node:fs/promises'
import { resolve, relative, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parse } from 'node-html-parser'

export const keyPages = [
  ['index.html', 'MindQuantum'],
  ['zh/index.html', 'MindQuantum'],
  ['docs/en/index.html', 'MindQuantum'],
  ['docs/zh/index.html', 'MindQuantum'],
  ['api/en/index.html', 'mq-docs-frame'],
  ['api/zh/index.html', 'mq-docs-frame'],
  ['courses/index.html', 'mq-courses-frame'],
  ['docs/en/src/beginner/quantum_simulator/index.html', 'Simulator'],
]

export function resolveInternalLink(value, page, files, base = '/', site) {
  const origin = new URL(site || 'https://verify.invalid').origin
  const prefix = '/' + base.split('/').filter(Boolean).join('/') + '/'
  const normalizedBase = prefix === '//' ? '/' : prefix
  const url = new URL(value, `${origin}${normalizedBase}${page}`)
  if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin) return null
  const pathname = decodeURIComponent(url.pathname)
  if (!pathname.startsWith(normalizedBase)) throw new Error('outside ASTRO_BASE')
  const target = pathname.slice(normalizedBase.length)
  const candidates = [target, target.replace(/\/$/, '') + '/index.html']
  if (!target) candidates.push('index.html')
  const found = candidates.find(candidate => files.has(candidate))
  if (!found) throw new Error(`missing ${target || 'index.html'}`)
  return found
}

export function verifyHtml(html, page, files, base = '/', site) {
  const errors = []
  for (const node of parse(html).querySelectorAll('[href], [src]')) {
    for (const attr of ['href', 'src']) {
      const value = node.getAttribute(attr)
      if (value === undefined) continue
      try {
        resolveInternalLink(value, page, files, base, site)
      } catch (error) {
        errors.push(`${page}: ${attr}=${JSON.stringify(value)} (${error.message})`)
      }
    }
  }
  return errors
}

export async function verifySite(root, { base = '/', site, pages = keyPages } = {}) {
  const files = new Set()
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) await walk(path)
      else files.add(relative(root, path).split('\\').join('/'))
    }
  }
  await walk(root)
  const errors = []
  let count = 0
  for (const file of files) {
    if (!file.endsWith('.html')) continue
    count++
    errors.push(...verifyHtml(await readFile(join(root, file), 'utf8'), file, files, base, site))
  }
  for (const [page, marker] of pages) {
    if (!files.has(page)) errors.push(`key page missing: ${page}`)
    else if (!(await readFile(join(root, page), 'utf8')).includes(marker)) {
      errors.push(`key page ${page}: missing marker ${JSON.stringify(marker)}`)
    }
  }
  return { errors, count, keyCount: pages.length }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { errors, count, keyCount } = await verifySite(resolve('dist'), {
    base: process.env.ASTRO_BASE || '/', site: process.env.SITE_URL,
  })
  if (errors.length) {
    console.error(`[verify-site] ${errors.length} failure(s):\n${errors.join('\n')}`)
    process.exitCode = 1
  } else console.log(`[verify-site] verified ${count} HTML files and ${keyCount} key pages.`)
}
