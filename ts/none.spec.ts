import t from 'assert'
import { a } from 'assertron'
import { createSatisfier, none } from './index.js'

test('non array returns false', () => {
  a.false(createSatisfier(none({ a: 1 })).test(true))
  a.false(createSatisfier(none({ a: 1 })).test(1))
  a.false(createSatisfier(none({ a: 1 })).test('{ a: 1 }'))
  a.false(createSatisfier(none({ a: 1 })).test({ a: 1 }))
})

test('array with no match returns true', () => {
  t(createSatisfier(none({ a: 1 })).test([{ b: 1 }]))
})

test('array with one match returns false', () => {
  a.false(createSatisfier(none({ a: 1 })).test([{ a: 1 }]))
  a.false(createSatisfier(none({ a: 1 })).test([{ b: 1 }, { a: 1 }]))
})

test('tersify()', () => {
  t.strictEqual(none({ a: 1 }).tersify(), 'none({ a: 1 })')
})
