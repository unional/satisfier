import t from 'assert'
import { a } from 'assertron'

import { createSatisfier, every } from './index.js'

test('non array returns false', () => {
  a.false(createSatisfier(every({ a: 1 })).test(true))
  a.false(createSatisfier(every({ a: 1 })).test(1))
  a.false(createSatisfier(every({ a: 1 })).test('{ a: 1 }'))
  a.false(createSatisfier(every({ a: 1 })).test({ a: 1 }))
})

test('array with no match returns false', () => {
  a.false(createSatisfier(every({ a: 1 })).test([{ b: 1 }]))
})

test('array with only one match returns false', () => {
  t(createSatisfier(every({ a: 1 })).test([{ a: 1 }]))
  a.false(createSatisfier(every({ a: 1 })).test([{ b: 1 }, { a: 1 }]))
})


test('array with all match returns true', () => {
  t(createSatisfier(every({ a: 1 })).test([{ a: 1 }, { a: 1 }]))
  a.false(createSatisfier(every({ a: 1 })).test([{ b: 1 }, { a: 1 }, { a: 1 }, 'x']))
})

test('against each element in array in deep level', () => {
  const actual = createSatisfier(every({ a: { b: { c: /foo/ } } })).exec([{ a: {} }, { a: { b: {} } }, { a: { b: { c: 'boo' } } }])
  expect(actual)
    .toEqual([
      { actual: undefined, expected: { c: /foo/ }, path: [0, 'a', 'b'] },
      { actual: undefined, expected: /foo/, path: [1, 'a', 'b', 'c'] },
      { actual: 'boo', expected: /foo/, path: [2, 'a', 'b', 'c'] }
    ])
})

test('tersify()', () => {
  t.strictEqual(every({ a: 1 }).tersify(), 'every({ a: 1 })')
})
