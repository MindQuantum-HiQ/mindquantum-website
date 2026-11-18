import { spawn } from 'node:child_process'
import { cp, mkdir, rm, stat, readdir, readFile, writeFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { patchCopyrightYears } from './update-copyright.mjs'
import { normalizeSphinxHtml } from './sphinx-assets.mjs'

async function normalizeAssets(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name)
    if (entry.isDirectory()) await normalizeAssets(file)
    else if (entry.name.endsWith('webpack-macros.html')) await rm(file)
    else if (entry.name.endsWith('.html')) {
      const html = await readFile(file, 'utf8')
      const normalized = normalizeSphinxHtml(html)
      if (html !== normalized) await writeFile(file, normalized)
    }
  }
}

function run(cmd, args, opts = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32', ...opts })
    child.on('close', (code) => {
      if (code === 0) resolvePromise()
      else reject(new Error(`${cmd} exited with ${code}`))
    })
  })
}

async function exists(p) {
  try { await stat(p); return true } catch { return false }
}

async function buildBook(lang) {
  const proj = resolve(`docs/${lang}`)
  const outRoot = resolve(`docs/_build/books/${lang}`)
  const dst = resolve(`public/docs/${lang}`)
  // Build into a per-language folder under docs/_build/books
  await run('jupyter-book', ['build', proj, '--path-output', outRoot])
  // Jupyter Book writes to <path-output>/_build/html
  const src = resolve(outRoot, '_build/html')
  if (await exists(dst)) await rm(dst, { recursive: true, force: true })
  await mkdir(dst, { recursive: true })
  await cp(src, dst, { recursive: true })
  await normalizeAssets(dst)
  console.log(`Copied ${lang} book → ${dst}`)
}

async function buildCourses() {
  const proj = resolve('courses')
  const outRoot = resolve('courses/_build/book')
  const dstRoot = resolve('public/courses')
  const lang = 'zh'
  const dst = resolve(dstRoot, lang)
  await run('jupyter-book', ['build', proj, '--path-output', outRoot])
  const src = resolve(outRoot, '_build/html')
  if (await exists(dstRoot)) await rm(dstRoot, { recursive: true, force: true })
  await mkdir(dst, { recursive: true })
  await cp(src, dst, { recursive: true })
  await normalizeAssets(dst)
  console.log(`Copied courses (${lang}) book → ${dst}`)
}

async function buildSphinx(api, lang) {
  const proj = resolve(`docs/${api}`) // api-en or api-zh
  const out = resolve(`docs/_build/api/${lang}`)
  const dst = resolve(`public/docs/api/${lang}`)
  // Always write output so shared static assets refresh even when no RST
  // changed; Sphinx otherwise skips its writing/static-copy phase.
  await run('sphinx-build', ['-b', 'html', '-a', proj, out])
  if (await exists(dst)) await rm(dst, { recursive: true, force: true })
  await mkdir(dst, { recursive: true })
  await cp(out, dst, { recursive: true })
  await normalizeAssets(dst)
  console.log(`Copied ${api} → ${dst}`)
}

async function main() {
  // Ensure docs sources are present (auto-clone upstreams if needed)
  await run('python', ['scripts/sync_all.py'])
  // Sync design tokens first so docs use latest variables
  await run('node', ['scripts/prepare-tokens.mjs'])
  // Vendor MathJax into docs/_static so formulas render without a public CDN
  await run('node', ['scripts/prepare-mathjax.mjs'])
  // Jupyter Book configs carry a {year} copyright placeholder: substitute the
  // build year for the duration of the build, then restore the placeholder
  const restoreCopyright = await patchCopyrightYears()
  try {
    // Generate _toc.yml for both books (tutorials only)
    await run('python', ['scripts/generate_toc.py'])
    // Normalize book sources to avoid toctree warnings and fix API tile link
    await run('python', ['scripts/normalize_book_sources.py'])
    await buildBook('en')
    await buildBook('zh')
    await buildCourses()
    // Build API (Sphinx) and place under /docs/api/{en,zh}
    await buildSphinx('api-en', 'en')
    await buildSphinx('api-zh', 'zh')
  } finally {
    await restoreCopyright()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
