import t from 'assert'
import a from 'assertron'

import { createSatisfier, every } from './index'

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

test('tersify()', () => {
  t.equal(every({ a: 1 }).tersify(), 'every({ a: 1 })')
})
