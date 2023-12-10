# Media Use Custom Media [<img src="https://jonathantneal.github.io/stylelint-logo.svg" alt="stylelint" width="90" height="90" align="right">][stylelint]

[![NPM Version][npm-img]][npm-url]
[![test](https://github.com/csstools/stylelint-media-use-custom-media/actions/workflows/test.yml/badge.svg)](https://github.com/csstools/stylelint-media-use-custom-media/actions/workflows/test.yml)
[![Support Chat][git-img]][git-url]

[Media Use Custom Media] is a [stylelint] rule to enforce usage of custom media
queries in CSS.

## Usage

Add [stylelint] and [Media Use Custom Media] to your project.

```bash
npm install stylelint stylelint-media-use-custom-media --save-dev
```

Add [Media Use Custom Media] to your [stylelint configuration].

```js
{
  "plugins": [
    "stylelint-media-use-custom-media"
  ],
  "rules": {
    "csstools/media-use-custom-media": "always" || "always-known" || "known" || "never" || "ignore"
  }
}
```

## Options

### always

If the first option is `"always"` or `true`, then [Media Use Custom Media]
requires all `@media` queries to use Custom Media, and the following patterns
are _not_ considered violations:

```pcss
@media (--sm) {}

@media (--sm), (--md) {}

@media screen and (--sm) {}
```

While the following patterns are considered violations:

```pcss
@media (max-width: 40rem) {}

@media (max-width: 40rem), (--md) {}
```

### never

If the first option is `"never"`, then [Media Use Custom Media]
requires all `@media` queries to not use Custom Media, and the following
patterns are _not_ considered violations:

```pcss
@media (max-width: 40rem) {}

@media screen and (max-width: 40rem) {}
```

While the following patterns are considered violations:

```pcss
@media (--md) {}

@media screen and (--md) {}

@media (--md), (max-width: 40rem) {}
```

### known

If the first option is `"known"`, then [Media Use Custom Media] requires all
`@media` queries referencing Custom Media to be known from either
`@custom-media` declarations in the file or imported using the second
option. Then the following patterns are _not_ considered violations:

```pcss
@custom-media --sm (min-width: 40rem);

@media (--sm) {}

@media (--sm), (min-width: 40rem) {}
```

While the following patterns are considered violations:

```pcss
@media (--md) {}

@media (--md), (min-width: 40rem) {}
```

### always-known

If the first option is `"always-known"`, then [Media Use Custom Media] requires all
`@media` queries to use known Custom Media from either `@custom-media`
declarations in the file or imported using the second option. Then the
following patterns are _not_ considered violations:

```pcss
@custom-media --sm (min-width: 40rem);

@media (--sm) {}
```

While the following patterns are considered violations:

```pcss
@custom-media --sm (min-width: 40rem);

@media (--sm), (min-width: 40rem) {}

@media (--md) {}
```

### ignore

If the first option is `"ignore"` or `null`, then [Media Use Custom Media] does
nothing.

---

### importFrom

When the first option is `"always-known"` or `"known"`, then the second option
can specify sources where Custom Properties should be imported from by using an
`importFrom` key. These imports might be CSS, JS, and JSON files, functions,
and directly passed objects.

```js
// .stylelintrc
{
  "plugins": [
    "stylelint-media-use-custom-media"
  ],
  "rules": {
    "csstools/media-use-custom-media": ["known", {
      "importFrom": [
        "path/to/file.css", // => @custom-media --sm (min-width: 40rem);
        "path/to/file.json" // => { "custom-media": { "--sm": "(min-width: 40rem)" } }
      ]
    }
  }
}
```

[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/stylelint/stylelint
[npm-img]: https://img.shields.io/npm/v/stylelint-media-use-custom-media.svg
[npm-url]: https://www.npmjs.com/package/stylelint-media-use-custom-media

[stylelint]: https://github.com/stylelint/stylelint
[stylelint configuration]: https://github.com/stylelint/stylelint/blob/master/docs/user-guide/configuration.md#readme
[Media Use Custom Media]: https://github.com/csstools/stylelint-media-use-custom-media
