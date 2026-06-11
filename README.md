# click-to-source

Alt+click any element to open its source in VS Code.

## Install

```bash
npm install click-to-source
```

### Local Development

To use a local copy as a dependency:

```bash
# In your project
npm link /path/to/click-to-source

# Or with pnpm
pnpm link /path/to/click-to-source
```

## Usage

### Vite

```js
// vite.config.js
import { clickToSource } from 'click-to-source/vite'

export default {
  plugins: [clickToSource(), react()]
}
```

```js
// main.js
import 'click-to-source'
```

### Astro

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import { clickToSource } from 'click-to-source/astro'

export default defineConfig({
  integrations: [clickToSource()]
})
```

Works with both `.astro` files (uses Astro's native source attributes) and framework components (React, Svelte, Vue).

### Babel (Webpack, Next.js, CRA, etc.)

```js
// babel.config.js
module.exports = {
  plugins: ['click-to-source/babel']
}
```

```js
// main.js
import 'click-to-source'
```

Set the project root (for VS Code URLs):

```html
<script>document.documentElement.dataset.ctsRoot = '/absolute/path/to/project'</script>
```

## How to Use

1. Hold **Alt** (Option on Mac)
2. Hover over any element
3. Click to copy path + open in VS Code

## How It Works

**Build time**: Plugin injects `data-cts-loc="file:line"` into JSX elements

```jsx
// Input
<Button>Click</Button>

// Output
<Button data-cts-loc="src/App.tsx:42">Click</Button>
```

**Runtime**: Web component reads these attributes and provides the UI.

## Options

### Vite

```js
clickToSource({
  // Skip files whose module id matches any pattern (substring or RegExp)
  exclude: ['node_modules/.vite', /\.stories\.[jt]sx?$/]
})
```

### Babel

```js
['click-to-source/babel', {
  attribute: 'data-cts-loc'  // customize attribute name
}]
```

## Alternatives

| Feature | click-to-source | [react-dev-inspector](https://github.com/zthxxx/react-dev-inspector) | [click-to-component](https://github.com/ericclemmons/click-to-component) | [LocatorJS](https://www.locatorjs.com/) |
|---------|-----------------|-------------------|-------------------|-----------|
| Lines of code | ~400 | ~5000+ | ~1500 | ~2000 |
| Dependencies | 0 | Many | Few | Few |
| Build step | None | TypeScript | TypeScript | TypeScript |
| VS Code | ✅ | ✅ | ✅ | ✅ |
| Other editors | ❌ | ✅ | ✅ | ✅ |
| Vite | ✅ | ✅ | ✅ | ✅ |
| Astro | ✅ | ❌ | ❌ | ❌ |
| Babel | ✅ | ✅ | ❌ | ✅ |
| Framework plugins | ❌ | Umi, Next.js | ❌ | ❌ |
| Browser extension | ❌ | ❌ | ❌ | ✅ |
| Server required | ❌ | ✅ | ❌ | ❌ |

## Why use this one?

- **You can read the entire codebase in 5 minutes** — 4 small files, ~400 lines total
- **Zero dependencies** — nothing to audit, nothing to break
- **No build step** — plain JS, copy and modify if you want
- **No server** — uses `vscode://` protocol directly

## When to use something else

- You need editors other than VS Code (WebStorm, Cursor, etc.)
- You want framework-specific integrations (Umi, Next.js plugins)
- You need battle-tested code used by thousands of projects

## Roadmap

### click-to-edit (planned)

Same idea — but for live editing content:

- Pencil icon appears on hover
- Click to edit text content inline
- Save button commits changes → creates PR or auto-deploys

Would work great with CMS-backed content (TinaCMS, etc.) or static text.

## License

MIT
