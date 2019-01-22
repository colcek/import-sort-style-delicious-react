const { computeMatchers } = require('./lib/matchers')
const { getConfigForFile } = require('./lib/config')

module.exports = function deliciouslySortImports(styleAPI, file) {
  const config = getConfigForFile(file)
  return computeMatchers({ styleAPI, config })
}
