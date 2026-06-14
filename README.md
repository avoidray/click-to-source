# click-to-source

Alt+click any element to open its source in VS Code.

> **Note on the name:** There's another project also called
> [`click-to-source`](https://github.com/mattkawczynski/click-to-source) by
> [@mattkawczynski](https://github.com/mattkawczynski). Same name, entirely by
> coincidence: we independently built tools that solve the same problem in
> slightly different ways.

## Install

```bash
pnpm add @avoidray/click-to-source
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
  // Skip files whose module id matches any pattern (substring or RegExp)
  exclude: ['node_modules/.vite', /\.stories\.[jt]sx?$/]
})
```
## Why use this one?

- **You can read the entire codebase in 5 minutes**: 2 small files, ~250 lines total
- **Zero dependencies**: nothing to audit, nothing to break
- **No build step**: plain JS, copy and modify if you want
- **No server**: uses `vscode://` protocol directly

## License

MIT
