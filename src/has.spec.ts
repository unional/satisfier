import { test } from 'ava'

import { createSatisfier, has } from './index'

test('non array returns false', t => {
  t.false(createSatisfier(has({ a: 1 })).test(true))
  t.false(createSatisfier(has({ a: 1 })).test(1))
  t.false(createSatisfier(has({ a: 1 })).test('{ a: 1 }'))
  t.false(createSatisfier(has({ a: 1 })).test({ a: 1 }))
})

test('array with no match returns false', t => {
  t.false(createSatisfier(has({ a: 1 })).test([{ b: 1 }]))
})

test('array with one match returns true', t => {
  t.true(createSatisfier(has({ a: 1 })).test([{ a: 1 }]))
  t.true(createSatisfier(has({ a: 1 })).test([{ b: 1 }, { a: 1 }]))
})


test('array with more than one match returns true', t => {
  t.true(createSatisfier(has({ a: 1 })).test([{ a: 1 }, { a: 1 }]))
  t.true(createSatisfier(has({ a: 1 })).test([{ b: 1 }, { a: 1 }, { a: 1 }, 'x']))
})

test('tersify()', t => {
  t.is(has({ a: 1 }).tersify(), 'has({ a: 1 })')
})
