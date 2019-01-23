# import-sort-style-delicious

A style for [import-sort](https://github.com/renke/import-sort) that lets you configure imports along axes useful at [Delicious Insights](https://delicious-insights.com/en/).

## Options

This can be configured in your project’s `package.json` (or more precisely, the closest `package.json` at or above the formatted file’s directory) using subkeys of the `deliciousImportSort` main key:

| Option         | Values                    | Default                            | Description                                                                                                                                                                                                                                                                                                                                                                                               |
| -------------- | ------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `customGroups` | Array or String           | `[]`                               | Lets you split main-order categories in several groups: first the one that wouldn’t match any of your custom groups, then one for each group, in the specified order. Groups are defined by either string prefixes or regexes.<br/><br/>If you need a single group, you can drop the surrounding brackets and use a single string or regexp.                                                             |
| `mainOrder`    | Array of category keys    | `['bare', 'absolute', 'relative']` | <ul><li>**Bare** imports use no local specifier, they’re just for side-effects (there is no `from` part).</li><li>**Absolute** imports target Node-core or `node_modules`-based modules</li><li>**Relative** imports are “project-local” and start with either `./` or `../`.</li><li>Should you not wish to distinguish between absolute and relative, the `'regular'` keyword merges both.</li></ul> |
| `sortStyle`    | `'natural'` or `'unicde'` | `'natural'`                        | <ul><li>**Natural** ordering uses `String#localeCompare`, which gives more natural-feeling results (e.g. case is usually folded, and diacritics don’t end up last).</li><li>**Unicode** ordering is lexicographical: it follows the codepoint positions in the Unicode table.</li></ul>                                                                                                                  |

## Using this style in VS Code

1. Start by making sure you have the [sort-imports](https://marketplace.visualstudio.com/items?itemName=amatiasq.sort-imports) extension installed.
2. In the project you want to use that into, add the dependency with `npm install --save-dev import-sort-style-delicious`
3. Open your **VS Code Preferences** (either *User* or *Workspace*, depending on the scope you want) and look for the *"Sort Imports configuration"* entry in the *Extensions* part (or just fuzzy-find it).  In the *Default-sort-style* setting, type `delicious` (or the whole module name if you prefer), then save your settings.
4. In your project’s `package.json`, add whatever custom configuration you would like if the defaults aren’t enough for you (this is usually about custom groups).  See below for a short example configuration.
5. Save your files and behold!

Note that the configuration is re-read on each formatting, intentionally (this takes only a couple milliseconds), so you can tweak it and test (by re-saving your file) easily, without having to reload VS Code’s window or anything.

## Updating your codebase in one go

This is a style for the [import-sort](https://github.com/deliciousinsights/import-sort#readme) tool, that offers a [CLI](https://github.com/deliciousinsights/import-sort#command-line-import-sort-cli) you can use once you configured our style through the [configuration](https://github.com/deliciousinsights/import-sort#using-a-different-style-or-parser).  You could then just do something like this:

```sh
npm install -save-dev import-sort-cli import-sort-parser-babylon import-sort-style-delicious
# Set up your `importSort` config key in `package.json`, if you haven't already, then:
npx import-sort --write
```

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

This package is copyright © 2019 Delicious Insights, and made available under the MIT license.
