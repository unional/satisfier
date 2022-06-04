import t from 'assert'
import a from 'assertron'

import { createSatisfier, satisfies, some } from './index.js'

test('non array returns false', () => {
  a.false(createSatisfier(some({ a: 1 })).test(true))
  a.false(createSatisfier(some({ a: 1 })).test(1))
  a.false(createSatisfier(some({ a: 1 })).test('{ a: 1 }'))
  a.false(createSatisfier(some({ a: 1 })).test({ a: 1 }))
})

test('array with no match returns false', () => {
  a.false(createSatisfier(some({ a: 1 })).test([{ b: 1 }]))
})

test('array with one match returns true', () => {
  t(createSatisfier(some({ a: 1 })).test([{ a: 1 }]))
  t(createSatisfier(some({ a: 1 })).test([{ b: 1 }, { a: 1 }]))
})

test('array with more than one match returns true', () => {
  t(createSatisfier(some({ a: 1 })).test([{ a: 1 }, { a: 1 }]))
  t(createSatisfier(some({ a: 1 })).test([{ b: 1 }, { a: 1 }, { a: 1 }, 'x']))
})

test('tersify()', () => {
  t.strictEqual(some({ a: 1 }).tersify(), 'some({ a: 1 })')
})

test('match second', () => {
  satisfies(['first', 'second'], some('second'))
})
