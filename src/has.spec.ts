import { test } from 'ava'

import { createSatisfier } from './createSatisfier'
import { has } from './has'

test('non array returns false', t => {
  t.false(createSatisfier(has(1)).test(undefined))
  t.false(createSatisfier(has(1)).test(null))
  t.false(createSatisfier(has(1)).test(1))
  t.false(createSatisfier(has(1)).test(true))
  t.false(createSatisfier(has(1)).test('a'))
  t.false(createSatisfier(has({ a: 1 })).test(true))
  t.false(createSatisfier(has({ a: 1 })).test(1))
  t.false(createSatisfier(has({ a: 1 })).test('{ a: 1 }'))
  t.false(createSatisfier(has({ a: 1 })).test({ a: 1 }))
})

test('array with no match returns false', t => {
  t.false(createSatisfier(has(1)).test([2, 2, 3]))
  t.false(createSatisfier(has({ a: 1 })).test([{ b: 1 }]))
})

test('exact match array returns true', t => {
  t.true(createSatisfier(has(1)).test([1]))
  t.true(createSatisfier(has(false, false)).test([false, false]))
  t.true(createSatisfier(has('a', 'b')).test(['a', 'b']))
  t.true(createSatisfier(has({ a: 1 })).test([{ a: 1 }]))
  t.true(createSatisfier(has({ a: 1 })).test([{ b: 1 }, { a: 1 }]))
})

test('array with more than one match returns true', t => {
  t.true(createSatisfier(has({ a: 1 })).test([{ a: 1 }, { a: 1 }]))
  t.true(createSatisfier(has({ a: 1 })).test([{ b: 1 }, { a: 1 }, { a: 1 }, 'x']))
})

test('with not matched entries before match returns true', t => {
  t.true(createSatisfier(has(3)).test([1, 2, 3]))
})

test('with not matched entries after match returns true', t => {
  t.true(createSatisfier(has(1)).test([1, 2, 3]))
})

test('pass when the matched entry is in between others', t => {
  t.true(createSatisfier(has(2)).test([1, 2, 3]))
})

test('pass when there are unmatched entry between matched one', t => {
  t.true(createSatisfier(has(1, 3)).test([1, 2, 3]))
})

test('tersify()', t => {
  t.is(has({ a: 1 }, { b: 2 }).tersify(), 'has({ a: 1 }, { b: 2 })')
})
