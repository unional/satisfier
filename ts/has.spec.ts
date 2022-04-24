import t from 'assert'
import a from 'assertron'
import { createSatisfier, has } from '.'

test('non array returns false', () => {
  a.false(createSatisfier(has(1)).test(undefined))
  a.false(createSatisfier(has(1)).test(null))
  a.false(createSatisfier(has(1)).test(1))
  a.false(createSatisfier(has(1)).test(true))
  a.false(createSatisfier(has(1)).test('a'))
  a.false(createSatisfier(has({ a: 1 })).test(true))
  a.false(createSatisfier(has({ a: 1 })).test(1))
  a.false(createSatisfier(has({ a: 1 })).test('{ a: 1 }'))
  a.false(createSatisfier(has({ a: 1 })).test({ a: 1 }))
})

test('array with no match returns false', () => {
  a.false(createSatisfier(has(1)).test([2, 2, 3]))
  a.false(createSatisfier(has({ a: 1 })).test([{ b: 1 }]))
})

test('exact match array returns true', () => {
  t(createSatisfier(has(1)).test([1]))
  t(createSatisfier(has(false, false)).test([false, false]))
  t(createSatisfier(has('a', 'b')).test(['a', 'b']))
  t(createSatisfier(has({ a: 1 })).test([{ a: 1 }]))
  t(createSatisfier(has({ a: 1 })).test([{ b: 1 }, { a: 1 }]))
})

test('array with more than one match returns true', () => {
  t(createSatisfier(has({ a: 1 })).test([{ a: 1 }, { a: 1 }]))
  t(createSatisfier(has({ a: 1 })).test([{ b: 1 }, { a: 1 }, { a: 1 }, 'x']))
})

test('with not matched entries before match returns true', () => {
  t(createSatisfier(has(3)).test([1, 2, 3]))
})

test('with not matched entries after match returns true', () => {
  t(createSatisfier(has(1)).test([1, 2, 3]))
})

test('pass when the matched entry is in between others', () => {
  t(createSatisfier(has(2)).test([1, 2, 3]))
})

test('pass when there are unmatched entry between matched one', () => {
  t(createSatisfier(has(1, 3)).test([1, 2, 3]))
})

test('fails when not all entries are matched', () => {
  t(!createSatisfier(has(1, 4)).test([1, 2, 3]))
})

test('tersify()', () => {
  t.strictEqual(has({ a: 1 }, { b: 2 }).tersify(), 'has({ a: 1 }, { b: 2 })')
})
