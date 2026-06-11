const ATTR = 'data-cts-loc'

module.exports = function(_api, options) {
  const attr = options?.attribute || ATTR

  return {
    name: 'click-to-source',
    visitor: {
      JSXOpeningElement(path, state) {
        const line = path.node.loc?.start.line
        const file = state.filename?.replace(state.cwd + '/', '')
        if (!line || !file) return

        const hasAttr = path.node.attributes.some(
          a => a.type === 'JSXAttribute' && a.name?.name === attr
        )
        if (hasAttr) return

        path.node.attributes.push({
          type: 'JSXAttribute',
          name: { type: 'JSXIdentifier', name: attr },
          value: { type: 'StringLiteral', value: `${file}:${line}` }
        })
      }
    }
  }
}
