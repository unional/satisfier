# satisfier

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]

[![Circle CI][circleci-image]][circleci-url]
[![Travis CI][travis-image]][travis-url]
[![Codecov][codecov-image]][codecov-url]
[![Coveralls Status][coveralls-image]][coveralls-url]

[![Greenkeeper][greenkeeper-image]][greenkeeper-url]
[![Semantic Release][semantic-release-image]][semantic-release-url]

[![Visual Studio Code][vscode-image]][vscode-url]
[![Wallaby.js][wallaby-image]][wallaby-url]

A purposely loose comparison tool.

## Version 5 breaking changes

- exact check on array
- no spread on array, use `has()/some()` or `every()`
- `undefined` now checks against `undefined` instead of a placeholder for anything. Use `anything` for the previous behavior.

## createSatisfier(expectation)

Each property in `expectation` can be a value, a `RegExp`, or a predicate function.

### test(actual)

test `actual` against `expectation`.

```ts
import { createSatisfier } from 'satisfier'

// these returns true
createSatisfier({ a: 1 }).test({ a: 1, b: 2 })
createSatisfier({ a: /foo/ }).test({ a: 'foo', b: 'boo' })
createSatisfier({ a: n => n === 1 }).test({ a: 1, b, 2 })

// these returns false
createSatisfier({ a: 1 }).test({ a: 2 })
createSatisfier({ a: 1, b: 2 }).test({ a: 1 })
createSatisfier({ a: /boo/ }).test({ a: 'foo' })
createSatisfier({ a: () => false }).test({ a: 1 })
```

### exec(actual)

check `actual` against `expectation` and returns the checking result.
If `actual` meets the criteria, returns `null`.

```ts
import { createSatisfier } from 'satisfier'

// returns undefined
createSatisfier({ a: 1 }).exec({ a: 1, b: 2 })
createSatisfier({ a: /foo/ }).exec({ a: 'foo', b: 'boo' })
createSatisfier({ a: n => n === 1 }).exec({ a: 1, b, 2 })

// returns [{ path: ['a'], expected: 1, actual: 2}]
createSatisfier({ a: 1 }).exec({ a: 2 })

// returns [{ path: ['b'], expected: 2, actual: undefined}]
createSatisfier({ a: 1, b: 2 }).exec({ a: 1 })

// returns [{ path: ['a'], expected: /boo/, actual: 'foo'}]
createSatisfier({ a: /boo/ }).exec({ a: 'foo' })

// returns [{ path: ['a'], expected: 'a => a === 1', actual: 2}]
createSatisfier({ a: a => a === 1 }).exec({ a: 2 })
```

## `anything`

If `anything` is used in expectation, it will match anything.

```ts
import { anything } from 'satisfier'

createSatisfier(anything).test({})
createSatisfier({ a: anything }).test({})
createSatisfier([anything, 1]).test(['x', 1])
```

## test against array

There are several ways to test against array:

### using array expectation

When you use an array expectation to test against array,
each entry in the expectation will be used to test against the corresponding entry in the array.

You can also skip over entries by putting in `anything`.

```ts
import { createSatisfier } from 'satisfier'

// all true
createSatisfier([anything, 1]).test(['...anything...', 1])
createSatisfier([e => e === anything, 1]).test([anything, 1])
```

### using predicate expectation

You can test against the array using a predicate function.
The predicate function will receive the whole array.

This is useful if you want to check the relationship within the array.

```ts
import { createSatisfier } from 'satisfier'

createSatisfier(
  a =>
    Array.isArray(a) &&
    a.length === 2 &&
    a[0] === 1 &&
    a[1] === 2)
  .test([1, 2])
```

### using primitive and object expectation

When the expectation is a primitive value or an object,
it will be used to check against each element in the array.

```ts
import { createSatisfier } from 'satisfier'

// true
createSatisfier(1).test([1, 1])
createSatisfier(false).test([false, false])
createSatisfier('a').test(['a', 'a'])
createSatisfier({ a: e => typeof e === 'string' })
  .test([{ a: 'a' }, { a: 'b' }]))

```

## Build in predicates

There are a few predicates shipped in the package for convenience.
They all support [`tersify`](https://github.com/unional/tersify).
This means if you use `tersify` to print the predicate (e.g. for logging purpose),
you will get a terse string representing the predicates.

For example:

```ts
import { createSatisfier, isInRange } from 'satisfier'

const results = createSatisfier(isInRange(1, 3)).exec(0)

// prints '[1...3]'
results[0].expected.tersify()
// { path: [], expected: [1...3], actual: 0 }
tersify(results[0])
```

Examples of predicate:  `every`, `has`, `isInInterval`, `isInRange`, `isTypeOf`, `none`, `some`, `startsWith`

## Contribute

```sh
# after fork and clone
npm install

# begin making changes
git checkout -b <branch>
npm run watch

# after making change(s)
git commit -m "<commit message>"
git push

# create PR
```

[circleci-image]: https://circleci.com/gh/unional/satisfier/tree/master.svg?style=shield
[circleci-url]: https://circleci.com/gh/unional/satisfier/tree/master
[codecov-image]: https://codecov.io/gh/unional/satisfier/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/unional/satisfier
[coveralls-image]: https://coveralls.io/repos/github/unional/satisfier/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/unional/satisfier?branch=master
[downloads-image]: https://img.shields.io/npm/dm/satisfier.svg?style=flat
[downloads-url]: https://npmjs.org/package/satisfier
[greenkeeper-image]: https://badges.greenkeeper.io/unional/satisfier.svg
[greenkeeper-url]: https://greenkeeper.io/
[npm-image]: https://img.shields.io/npm/v/satisfier.svg?style=flat
[npm-url]: https://npmjs.org/package/satisfier
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[travis-image]: https://img.shields.io/travis/unional/satisfier/master.svg?style=flat
[travis-url]: https://travis-ci.org/unional/satisfier?branch=master
[unstable-image]: https://img.shields.io/badge/stability-unstable-yellow.svg
[vscode-image]: https://img.shields.io/badge/vscode-ready-green.svg
[vscode-url]: https://code.visualstudio.com/
[wallaby-image]: https://img.shields.io/badge/wallaby.js-configured-green.svg
[wallaby-url]: https://wallabyjs.com
