# satisfier

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]

[![GitHub NodeJS][github-nodejs]][github-action-url]
[![Codecov][codecov-image]][codecov-url]

[![Semantic Release][semantic-release-image]][semantic-release-url]

[![Visual Studio Code][vscode-image]][vscode-url]

A purposely loose comparison tool.

## Version 5 breaking changes

- Exact check on array
- No spread on array, use `has()/some()` or `every()`
- `undefined` now checks against `undefined` instead of a placeholder for anything. Use `anything` for the previous behavior.

## satisfies(actual, expected)

The simplest way to use `satisfier`.

```ts
import { satisfies } from 'satisfier'

satisfies(1, 1)  // true
satisfies({ a: 1 }, { a: v => v === 1}) // true
satisfies([{ a: { b: 'b' }}], [{ a: { b: v => v === 'b' } }]) // true
```

Code completion is available to help you quickly creating your expectation.

## createSatisfier(expectation)

Each property in `expectation` can be a value, a `RegExp`, or a predicate function.

### test(actual)

Test `actual` against `expectation`.

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

Check `actual` against `expectation` and returns the checking result.
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

## Test against array

There are several ways to test against array:

### Using array expectation

When you use an array expectation to test against array,
each entry in the expectation will be used to test against the corresponding entry in the array.

You can also skip over entries by putting in `anything`.

```ts
import { createSatisfier } from 'satisfier'

// all true
createSatisfier([anything, 1]).test(['...anything...', 1])
createSatisfier([e => e === anything, 1]).test([anything, 1])
```

### Using predicate expectation

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

### Using primitive and object expectation

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

Examples of predicate: `every`, `has`, `isInInterval`, `isInRange`, `isTypeOf`, `none`, `some`, `startsWith`

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

[codecov-image]: https://codecov.io/gh/unional/satisfier/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/unional/satisfier
[downloads-image]: https://img.shields.io/npm/dm/satisfier.svg?style=flat
[downloads-url]: https://npmjs.org/package/satisfier
[github-action-url]: https://github.com/unional/satisfier/actions
[github-nodejs]: https://github.com/unional/satisfier/workflows/nodejs/badge.svg
[npm-image]: https://img.shields.io/npm/v/satisfier.svg?style=flat
[npm-url]: https://npmjs.org/package/satisfier
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[vscode-image]: https://img.shields.io/badge/vscode-ready-green.svg
[vscode-url]: https://code.visualstudio.com/
