# import-sort-style-delicious

A style for [import-sort](https://github.com/renke/import-sort) that lets you configure imports along axes useful at [Delicious Insights](https://delicious-insights.com/en/).

## Options

This can be configured in your project’s `package.json` (or more precisely, the closest `package.json` at or above the formatted file’s directory) using subkeys of the `deliciousImportSort` main key:

| Option         | Values                    | Default                            | Description                                                                                                                                                                                                                                                                                                                                                   |
| -------------- | ------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `customGroups` | Array                     | `[]`                               | Lets you split main-order categories in several groups: first the one that wouldn’t match any of your custom groups, then one for each group, in the specified order. Groups are defined by either string prefixes or regexes.                                                                                                                               |
| `mainOrder`    | Array of category keys    | `['bare', 'absolute', 'relative']` | Bare imports use no local specifier, they’re just for side-effects (there is no `from` part).  Absolute imports target Node-core or `node_modules`-based modules, whilst relative imports are “project-local” and start with either `./` or `../`.  Should you not wish to distinguish between absolute and relative, the `'regular'` keyword merges both. |
| `sortStyle`    | `'natural'` or `'unicde'` | `'natural'`                        | Natural ordering uses `String#localeCompare`, which gives more natural-feeling results (e.g. case is usually folded, and diacritics don’t end up last). Unicode ordering is lexicographical: it follows the codepoint positions in the Unicode table.                                                                                                        |

## Example custom configuration

Your `package.json` could go with default main order and sort style, but just define a custom group for Material-UI modules:

```json
"deliciousImportSort": {
  "customGroups": ["@material-ui"]
},
```

## Example output

```js
// Bare modules first (absolutes, then relatives)
import './LoginScreen.styl'

// Absolute modules, except for our custom groups, in natural order.
// When mixing default and named imports, the default import’s local name
// is used.  When only on named imports, the “lowest” local alias is used
// (multiple named imports are sorted too, using the same `sortStyle`).
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { hot } from 'react-hot-loader/root'
import React, { Component } from 'react'

// Absolute modules for our custom groups, using the same in-group
// sorting mechanisms.
import ArrowForward from '@material-ui/icons/ArrowForward'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Snackbar from '@material-ui/core/Snackbar'
import TextField from '@material-ui/core/TextField'

// Relative modules, using the same in-group sorting mechanisms.
// As we do not have relative modules matching our custom groups,
// there is only one block here.
import { func, LoginStatePropType } from '../shared/prop-types'
import { logIn } from '../reducers/currentUser'
import TogglablePasswordField from './TogglablePasswordField'
```

## Contributing

Did we let something slip?  Do you have an awesome extra feature idea?  Cool, let us know.  Check out [our guide](./CONTRIBUTING.md) to get started.

## License

This package is copyright (c) 2019 Delicious Insights, and made available under the MIT license.
