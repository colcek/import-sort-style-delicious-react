const { dirname } = require('path')
const { sync: readPackageConfig } = require('read-pkg-up')

module.exports = { getConfigForFile }

// Configuration should appear in the closest `package.json` file above the
// formatted file, in `deliciousImportSort`.
const DEFAULT_CONFIG = {
  // Items can be either string prefixes or regexes.  These test against the
  // module name as it appears in import statements.
  customGroups: [],
  // Main order entries are normalized and deduped.  The allowed canonical
  // values are (other values are ignored):
  // - 'bare' = no-specifier imports (for side-effects)
  // - 'absolute' = non-relative imports (node_modules / Node core)
  // - 'relative' = relative imports, i.e. project-local
  // - 'regular' = merges 'absolute' and 'relative'.  If all three are
  //   specified, 'regular' is stripped.  If 'regular' and one of the others is
  //   specified, 'regular' is converted to the missing subset.
  mainOrder: ['bare', 'absolute', 'relative'],
  // How to sort imports and named specifier lists (in that latter case, aliases
  // are used, if present).  Possible values are 'natural' and 'unicode'.
  sortStyle: 'natural',
}

function getConfigForFile(file) {
  const { pkg: relevantPackageConfig } = readPackageConfig({
    cwd: dirname(file),
  })

  const config = {
    customGroups: [...DEFAULT_CONFIG.customGroups],
    mainOrder: [...DEFAULT_CONFIG.mainOrder],
    sortStyle: DEFAULT_CONFIG.sortStyle,

    ...relevantPackageConfig.deliciousImportSort,
  }
  config.customGroups = ensureUsefulCustomGroups(config.customGroups)
  config.mainOrder = ensureUsefulMainOrder(config.mainOrder)

  return config
}

// Internal helpers
// ----------------

function cleanup(arr, { normalize = false } = {}) {
  arr = arr.map((s) => String(s || '').trim()).filter(Boolean)
  if (normalize) {
    arr = arr.map((s) => s.toLowerCase())
  }
  return [...new Set(arr)]
}

function ensureUsefulCustomGroups(customGroups) {
  if (!Array.isArray(customGroups)) {
    customGroups = [customGroups]
  }
  return cleanup(customGroups)
}

function ensureUsefulMainOrder(order) {
  if (!Array.isArray(order)) {
    console.warn('Invalid mainOrder, must be an array.')
    return DEFAULT_CONFIG.mainOrder
  }

  order = cleanup(order, { normalize: true })
  if (!order.includes('bare')) {
    order.unshift('bare')
  }

  const hasRegular = order.includes('regular')
  const hasAbsolute = order.includes('absolute')
  const hasRelative = order.includes('relative')

  if (hasRegular && hasAbsolute && hasRelative) {
    order = order.filter((s) => s !== 'regular')
  }
  if (hasRegular && (hasAbsolute || hasRelative)) {
    order = order.map((s) =>
      s === 'regular' ? (hasAbsolute ? 'relative' : 'absolute') : s
    )
  }

  return order
}
