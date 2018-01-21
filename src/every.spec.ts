import { test } from 'ava'

import { createSatisfier, every } from './index'

test('non array returns false', t => {
  t.false(createSatisfier(every({ a: 1 })).test(true))
  t.false(createSatisfier(every({ a: 1 })).test(1))
  t.false(createSatisfier(every({ a: 1 })).test('{ a: 1 }'))
  t.false(createSatisfier(every({ a: 1 })).test({ a: 1 }))
})

test('array with no match returns false', t => {
  t.false(createSatisfier(every({ a: 1 })).test([{ b: 1 }]))
})

test('array with only one match returns false', t => {
  t.true(createSatisfier(every({ a: 1 })).test([{ a: 1 }]))
  t.false(createSatisfier(every({ a: 1 })).test([{ b: 1 }, { a: 1 }]))
})


test('array with all match returns true', t => {
  t.true(createSatisfier(every({ a: 1 })).test([{ a: 1 }, { a: 1 }]))
  t.false(createSatisfier(every({ a: 1 })).test([{ b: 1 }, { a: 1 }, { a: 1 }, 'x']))
})

test('tersify()', t => {
  t.is(every({ a: 1 }).tersify(), 'every({ a: 1 })')
})
