# click-to-source

> **Summary:** Vite plugin + zero-dependency web component. In dev, Alt/Option+click any rendered DOM element to jump straight to its JSX source in VS Code. Build-time plugin stamps `data-cts-loc="file:line"` onto JSX elements; a runtime web component reads the attribute and opens `vscode://file/...`. Install `@avoidray/click-to-source`, add `clickToSource()` to `vite.config` plugins, and `import '@avoidray/click-to-source'` in your entry file. Peer dep: Vite >=4 (optional). React/JSX. No server, no build step, no telemetry.

Alt+click any element to open its source in VS Code.

## Install

```bash
pnpm add @avoidray/click-to-source
```

## Usage

### Vite

```ts
// vite.config.ts
import { clickToSource } from '@avoidray/click-to-source/vite'

export default {
  plugins: [clickToSource(), react()]
}
```

```ts
// main.ts
import '@avoidray/click-to-source'
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

```js
clickToSource({
  // Skip files whose module id matches any pattern (substring or RegExp).
  // node_modules and non-JSX files are already skipped automatically.
  exclude: ['src/vendor/', /\.gen\.[jt]sx$/],

  // Keep the overlay up after Alt is released, so it can be screenshotted.
  // Leave off for normal use; turn on only when capturing screenshots.
  persistOverlay: true,
})
```
## Why use this one?

- **You can read the entire codebase in 5 minutes**: 2 small files, ~250 lines total
- **Zero dependencies**: nothing to audit, nothing to break
- **No build step**: plain JS, copy and modify if you want
- **No server**: uses `vscode://` protocol directly

## Deployment

CI runs `npm test` on every push and PR (`.github/workflows/test.yml`, Node 18/20/22).

Cutting a GitHub Release triggers `.github/workflows/publish.yml`, which tests and publishes to npm via [trusted publishing](https://docs.npmjs.com/trusted-publishers/) (OIDC). No tokens stored, provenance attached automatically.

## Note on the name

There's another project also called
[`click-to-source`](https://github.com/mattkawczynski/click-to-source) by
[@mattkawczynski](https://github.com/mattkawczynski). Same name, entirely by
coincidence: we independently built tools that solve the same problem in
slightly different ways.

## License

MIT
