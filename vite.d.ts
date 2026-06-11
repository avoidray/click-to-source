import type { Plugin } from 'vite'

export interface ClickToSourceOptions {
  /** Module IDs matching any pattern are skipped (regex tested or substring matched). */
  exclude?: (RegExp | string)[]
}

/** Vite plugin that adds click-to-source functionality */
export function clickToSource(options?: ClickToSourceOptions): Plugin
