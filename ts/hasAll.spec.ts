import t from 'assert'
import { a } from 'assertron'
import { createSatisfier, hasAll } from './index.js'

test('non array returns false', () => {
  a.false(createSatisfier(hasAll(1)).test(undefined))
  a.false(createSatisfier(hasAll(1)).test(null))
  a.false(createSatisfier(hasAll(1)).test(1))
  a.false(createSatisfier(hasAll(1)).test(true))
  a.false(createSatisfier(hasAll(1)).test('a'))
  a.false(createSatisfier(hasAll({ a: 1 })).test(true))
  a.false(createSatisfier(hasAll({ a: 1 })).test(1))
  a.false(createSatisfier(hasAll({ a: 1 })).test('{ a: 1 }'))
  a.false(createSatisfier(hasAll({ a: 1 })).test({ a: 1 }))
})

test('array with no match returns false', () => {
  a.false(createSatisfier(hasAll(1)).test([2, 2, 3]))
  a.false(createSatisfier(hasAll({ a: 1 })).test([{ b: 1 }]))
})

test('exact match array returns true', () => {
  t(createSatisfier(hasAll(1)).test([1]))
  t(createSatisfier(hasAll(false, false)).test([false, false]))
  t(createSatisfier(hasAll('a', 'b')).test(['a', 'b']))
  t(createSatisfier(hasAll({ a: 1 })).test([{ a: 1 }]))
  t(createSatisfier(hasAll({ a: 1 })).test([{ b: 1 }, { a: 1 }]))
})

test('array with more than one match returns true', () => {
  t(createSatisfier(hasAll({ a: 1 })).test([{ a: 1 }, { a: 1 }]))
  t(createSatisfier(hasAll({ a: 1 })).test([{ b: 1 }, { a: 1 }, { a: 1 }, 'x']))
})

it('is true if all entries are in the target', () => {
  t(createSatisfier(hasAll(1)).test([1, 2, 3]))
  t(createSatisfier(hasAll(2)).test([1, 2, 3]))
  t(createSatisfier(hasAll(3)).test([1, 2, 3]))
  t(createSatisfier(hasAll(1, 2)).test([1, 2, 3]))
  t(createSatisfier(hasAll(1, 3)).test([1, 2, 3]))
  t(createSatisfier(hasAll(2, 3)).test([1, 2, 3]))
  t(createSatisfier(hasAll(2, 1)).test([1, 2, 3]))
  t(createSatisfier(hasAll(3, 1)).test([1, 2, 3]))
  t(createSatisfier(hasAll(3, 1)).test([1, 2, 3]))
  t(createSatisfier(hasAll(1, 2, 3)).test([1, 2, 3]))
  t(createSatisfier(hasAll(1, 3, 2)).test([1, 2, 3]))
  t(createSatisfier(hasAll(2, 1, 3)).test([1, 2, 3]))
  t(createSatisfier(hasAll(2, 3, 1)).test([1, 2, 3]))
  t(createSatisfier(hasAll(3, 1, 2)).test([1, 2, 3]))
  t(createSatisfier(hasAll(3, 2, 1)).test([1, 2, 3]))
})

it('is true even if there are duplicates in expectation', () => {
  t(createSatisfier(hasAll(1, 1)).test([1, 2, 3]))
  t(createSatisfier(hasAll(1, 1, 2)).test([1, 2, 3]))
  t(createSatisfier(hasAll(1, 2, 1)).test([1, 2, 3]))
  t(createSatisfier(hasAll(2, 1, 1)).test([1, 2, 3]))
})

test('tersify()', () => {
  t.strictEqual(hasAll({ a: 1 }, { b: 2 }).tersify(), 'hasAll({ a: 1 }, { b: 2 })')
})
