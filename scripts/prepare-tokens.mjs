import { copyFile, readFile, writeFile } from 'node:fs/promises'

// Missing assets are build errors, never permission to deploy stale styles.
for (const [source, destination] of [
  ['tokens.css', 'mq-variables.css'],
  ['controls.css', 'mq-controls.css'],
  ['fonts.css', 'mq-fonts.css'],
]) {
  const src = `src/styles/${source}`
  const css = await readFile(src, 'utf8')
  await writeFile(`docs/_static/${destination}`, `/* Generated from ${src}; do not edit. */\n${css}`)
}
await copyFile('public/favicon.png', 'docs/_static/favicon.png')
console.log('Synced shared design system → docs/_static')
