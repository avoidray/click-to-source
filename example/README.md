# click-to-source example

The stock `pnpm create vite --template react-ts` app, with [`@avoidray/click-to-source`](../) added. Three touchpoints, nothing else:

- `package.json`: depends on the local package via `file:..`
- `vite.config.ts`: `clickToSource()` in `plugins`
- `src/main.tsx`: `import '@avoidray/click-to-source'`

```bash
pnpm install
pnpm dev
```

Then hold **Alt** (Option on Mac), hover any element, and click to open its JSX source in VS Code.
