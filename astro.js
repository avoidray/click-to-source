import { fileURLToPath } from 'url'

/**
 * click-to-source Astro integration
 *
 * For .astro files: Uses Astro's native data-astro-source-file/loc attributes (added in dev mode)
 * For .jsx/.tsx files: Injects data-cts-loc attributes via Vite transform
 *
 * @example
 * ```js
 * // astro.config.mjs
 * import { clickToSource } from 'click-to-source/astro'
 *
 * export default defineConfig({
 *   integrations: [clickToSource()]
 * })
 * ```
 *
 * @type {() => import('astro').AstroIntegration}
 */
export function clickToSource() {
  return {
    name: 'click-to-source',
    hooks: {
      'astro:config:setup': ({ config, updateConfig, injectScript }) => {
        const root = fileURLToPath(config.root)

        updateConfig({
          vite: {
            plugins: [{
              name: 'click-to-source',
              enforce: 'pre',
              apply: 'serve',

              // Transform .jsx/.tsx files (Astro handles .astro files natively)
              transform(code, id) {
                if (!id.match(/\.[tj]sx$/) || id.includes('node_modules')) return

                const rel = id.replace(root, '').replace(/^\//, '')
                const lines = code.split('\n')

                for (let i = 0; i < lines.length; i++) {
                  lines[i] = lines[i].replace(
                    /([^a-zA-Z0-9_])<([A-Z][a-zA-Z0-9]*|[a-z][a-zA-Z0-9-]*)(\s|>)/g,
                    (_, before, tag, after) => {
                      const loc = `${rel}:${i + 1}`
                      return after === '>'
                        ? `${before}<${tag} data-cts-loc="${loc}">`
                        : `${before}<${tag} data-cts-loc="${loc}"${after}`
                    }
                  )
                }

                return { code: lines.join('\n'), map: null }
              }
            }]
          }
        })

        injectScript('head-inline', `document.documentElement.dataset.ctsRoot = ${JSON.stringify(root)};`)
        injectScript('page', `import 'click-to-source';`)
      }
    }
  }
}
