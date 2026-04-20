import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'

// Allow setting base dynamically for GitHub Pages project sites
const base = process.env.ASTRO_BASE || '/'
const site = process.env.SITE_URL || undefined

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    react(),
    tailwind({
      // Do not inject a base stylesheet; we control imports via global.css
      applyBaseStyles: false,
    }),
  ],
})
