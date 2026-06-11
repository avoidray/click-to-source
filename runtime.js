const ATTR = 'data-cts-loc'

const TEMPLATE = `
<style>
  [data-info]:hover { color: rgba(255,255,255,0.7) !important; }
</style>
<div data-overlay style="
  position: fixed;
  pointer-events: none;
  border: 2px solid #3b82f6;
  border-radius: 4px;
  background: rgba(59, 130, 246, 0.1);
  z-index: 999998;
  transition: all 0.1s ease;
  display: none;
"></div>
<div data-tooltip style="
  position: fixed;
  background: rgba(24, 24, 27, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-family: monospace;
  z-index: 999999;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  display: none;
">
  <span data-hover-text></span>
  <div data-click-content style="display: none">
    <a data-file-link style="
      color: #60a5fa;
      text-decoration: underline;
      text-underline-offset: 2px;
      display: block;
      cursor: pointer;
    "></a>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px">
      <div data-subtext style="color: rgba(255,255,255,0.7); font-size: 10px; transition: opacity 0.2s"></div>
      <span data-info style="
        color: rgba(255,255,255,0.3);
        transition: color 0.2s;
        line-height: 0;
        cursor: pointer;
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4"/>
          <path d="M12 8h.01"/>
        </svg>
      </span>
    </div>
  </div>
</div>
`

class ClickToSource extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.innerHTML = TEMPLATE

    this.overlay = shadow.querySelector('[data-overlay]')
    this.tooltip = shadow.querySelector('[data-tooltip]')
    this.hoverText = shadow.querySelector('[data-hover-text]')
    this.clickContent = shadow.querySelector('[data-click-content]')
    this.fileLink = shadow.querySelector('[data-file-link]')
    this.subtext = shadow.querySelector('[data-subtext]')
    this.infoIcon = shadow.querySelector('[data-info]')

    this.clicked = false
    this.savedText = ''

    this.infoIcon.onmouseenter = () => {
      this.savedText = this.subtext.textContent || ''
      this.subtext.textContent = 'learn more'
    }
    this.infoIcon.onmouseleave = () => {
      this.subtext.textContent = this.savedText
    }
    this.infoIcon.onclick = (e) => {
      e.stopPropagation()
      window.open('https://github.com/avoidray/click-to-source', '_blank', 'noopener')
    }
    this.currentSource = null
    this.root = document.documentElement.dataset.ctsRoot || ''

    document.addEventListener('mousemove', (e) => {
      if (!e.altKey) {
        if (!this.clicked) this.hideAll()
        document.body.style.cursor = ''
        return
      }
      document.body.style.cursor = 'crosshair'
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (!el) return this.hideAll()

      const source = this.getSource(el)
      if (source) {
        this.currentSource = source
        const sourceEl = el.closest(`[${ATTR}]`) || el.closest('[data-astro-source-file]')
        this.showHover(sourceEl || el, source, e.clientX, e.clientY)
      } else if (!this.clicked) {
        this.hideAll()
      }
    })

    document.addEventListener('click', (e) => {
      if (!e.altKey || !this.currentSource) return
      if (e.composedPath().includes(this.tooltip)) return

      e.preventDefault()
      e.stopPropagation()
      this.showClicked(this.currentSource, e.clientX, e.clientY)
    }, true)

    document.addEventListener('keyup', (e) => {
      if (e.key === 'Alt') {
        document.body.style.cursor = ''
        this.hideAll()
      }
    })
  }

  getSource(el) {
    let current = el
    while (current) {
      // Check for our attribute
      const source = current.getAttribute?.(ATTR)
      if (source) return { type: 'cts', value: source }

      // Check for Astro's native attributes
      const astroFile = current.getAttribute?.('data-astro-source-file')
      const astroLoc = current.getAttribute?.('data-astro-source-loc')
      if (astroFile && astroLoc) {
        const line = astroLoc.split(':')[0]
        return { type: 'astro', file: astroFile, line, value: `${astroFile}:${line}` }
      }

      current = current.parentElement
    }
    return null
  }

  positionTooltip(mouseX, mouseY) {
    const rect = this.tooltip.getBoundingClientRect()
    const left = mouseX + 12 + rect.width > window.innerWidth ? mouseX - rect.width - 12 : mouseX + 12
    const top = mouseY + 12 + rect.height > window.innerHeight ? mouseY - rect.height - 12 : mouseY + 12
    Object.assign(this.tooltip.style, { left: `${left}px`, top: `${top}px` })
  }

  showHover(el, source, mouseX, mouseY) {
    if (this.clicked) return

    const rect = el.getBoundingClientRect()
    Object.assign(this.overlay.style, {
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      display: 'block',
    })

    // Show relative path for display
    const displayText = source.type === 'astro'
      ? source.file.replace(this.root, '') + ':' + source.line
      : source.value
    this.hoverText.textContent = displayText
    this.hoverText.style.display = ''
    this.clickContent.style.display = 'none'
    this.tooltip.style.pointerEvents = 'none'
    this.tooltip.style.display = 'block'
    this.positionTooltip(mouseX, mouseY)
  }

  showClicked(source, mouseX, mouseY) {
    this.clicked = true

    let file, line, url, displayText

    if (source.type === 'astro') {
      // Astro: file is already absolute
      file = source.file
      line = source.line
      url = `vscode://file${file}:${line}`
      displayText = file.replace(this.root, '') + ':' + line
    } else {
      // Our format: relative path
      ;[file, line] = source.value.split(':')
      url = `vscode://file${this.root}/${file}:${line}`
      displayText = source.value
    }

    navigator.clipboard.writeText(displayText).catch(() => {})

    this.fileLink.href = url
    this.fileLink.textContent = displayText
    this.fileLink.onclick = (e) => {
      e.preventDefault()
      window.location.href = url
    }
    this.subtext.textContent = '...'

    this.hoverText.style.display = 'none'
    this.clickContent.style.display = ''
    this.tooltip.style.pointerEvents = 'auto'
    this.tooltip.style.display = 'block'
    this.positionTooltip(mouseX, mouseY)

    setTimeout(() => this.subtext.textContent = 'Copied to clipboard', 300)
    setTimeout(() => this.subtext.textContent = 'click to open in VS Code', 1500)
  }

  hideAll() {
    this.overlay.style.display = 'none'
    this.tooltip.style.display = 'none'
    this.clicked = false
    this.currentSource = null
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('click-to-source')) {
  customElements.define('click-to-source', ClickToSource)
  document.body.appendChild(document.createElement('click-to-source'))
}
