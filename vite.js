import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ATTR = 'data-cts-loc'

/**
 * @typedef {{ exclude?: (RegExp | string)[] }} ClickToSourceOptions
 * @type {(options?: ClickToSourceOptions) => import('vite').Plugin}
 */
export function clickToSource(options = {}) {
  const exclude = options.exclude ?? []
  let root = ''
  let isServe = false

  return {
    name: 'click-to-source',
    enforce: 'pre',

    configResolved(config) {
      root = config.root
      isServe = config.command === 'serve'
    },

    resolveId(id) {
      if (id === '@avoidray/click-to-source') {
        return path.resolve(__dirname, 'runtime.js')
      }
    },

    // The root is an absolute build-machine path, so it is injected in dev
    // only. In a production build it is omitted to avoid shipping the path;
    // the runtime falls back to localStorage.ctsRoot for opt-in vscode links.
    transformIndexHtml() {
      if (!isServe) return
      return [{
        tag: 'script',
        attrs: { type: 'module' },
        children: `document.documentElement.dataset.ctsRoot = ${JSON.stringify(root)};`,
        injectTo: 'head-prepend'
      }]
    },

    transform(code, id) {
      if (!id.match(/\.[tj]sx$/) || id.includes('node_modules')) return
      for (const pattern of exclude) {
        if (typeof pattern === 'string' ? id.includes(pattern) : pattern.test(id)) return
      }

      const rel = path.relative(root, id)
      const lines = code.split('\n')

      for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(
          /([^a-zA-Z0-9_])<([A-Z][a-zA-Z0-9]*|[a-z][a-zA-Z0-9-]*)(\s|>)/g,
          (_, before, tag, after) => {
            const src = `${rel}:${i + 1}`
            return after === '>'
              ? `${before}<${tag} ${ATTR}="${src}">`
              : `${before}<${tag} ${ATTR}="${src}"${after}`
          }
        )
      }

      return { code: lines.join('\n'), map: null }
    },
  }
}
