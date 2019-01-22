module.exports = { computeMatchers }

function computeMatchers({ styleAPI, config }) {
  const matches = configureMatchMap(styleAPI)
  const { mainOrder } = config

  const matchers = mainOrder.reduce(
    (acc, orderKey) =>
      acc.concat(
        createMatchersFor({
          matches: matches[orderKey],
          bare: orderKey === 'bare',
        })
      ),
    []
  )

  return matchers
    .reduce((acc, matcher) => acc.concat([matcher, { separator: true }]), [])
    .slice(0, -1)

  // Internal helpers
  // ----------------

  function createMatchersFor({ matches = [], bare }) {
    const { customGroups, sortStyle } = config

    return matches.reduce((acc, match) => {
      const desc = createDescriptor({ bare, match, sortStyle })

      if (customGroups.length > 0) {
        return acc.concat(deriveByGroup({ customGroups, desc }))
      }

      return acc.concat([desc])
    }, [])
  }

  function createDescriptor({ bare, match, sortStyle }) {
    if (bare) {
      return { match }
    }

    const { alias, member, naturally, unicode } = styleAPI

    const sorter = sortStyle === 'unicode' ? unicode : naturally
    const sort = member(sorter)
    const sortNamedMembers = alias(sorter)
    return { match, sort, sortNamedMembers }
  }

  function deriveByGroup({ customGroups, desc }) {
    const { not, or } = styleAPI

    const noCustomGroupMatcher = not(
      or(...customGroups.map(matcherForModuleName))
    )

    return [patchDescriptor(desc, noCustomGroupMatcher)].concat(
      customGroups.map((group) =>
        patchDescriptor(desc, matcherForModuleName(group))
      )
    )
  }

  function matcherForModuleName(group) {
    const { moduleName } = styleAPI
    const groupIsRegExpy = typeof group.test === 'function'

    return moduleName((name) =>
      groupIsRegExpy ? group.test(name) : name.startsWith(group)
    )
  }

  function patchDescriptor(desc, moduleMatcher) {
    const { and } = styleAPI

    return { ...desc, match: and(desc.match, moduleMatcher) }
  }
}

function configureMatchMap({
  and,
  hasMember,
  hasNoMember,
  isAbsoluteModule,
  isRelativeModule,
}) {
  return {
    bare: [
      and(hasNoMember, isAbsoluteModule),
      and(hasNoMember, isRelativeModule),
    ],
    absolute: [and(hasMember, isAbsoluteModule)],
    regular: [hasMember],
    relative: [and(hasMember, isRelativeModule)],
  }
}
