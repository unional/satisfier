import { test } from 'ava'

import { createSatisfier } from './index'

test('empty expecter passes everything but not null or undefined', t => {
  t.true(createSatisfier({}).test({}))
  t.true(createSatisfier({}).test({ a: 1 }))
  t.true(createSatisfier({}).test({ a: true }))
  t.true(createSatisfier({}).test({ a: 'a' }))
  t.true(createSatisfier({}).test({ a: [1, true, 'a'] }))
  t.true(createSatisfier({}).test({ a: { b: 'a' } }))
  t.true(createSatisfier({}).test([{}, { a: 1 }]))
  t.false(createSatisfier({}).test(null))
  t.false(createSatisfier({}).test(undefined as any))
})

test('expect null to pass only null', t => {
  t.true(createSatisfier(null).test(null))
  t.false(createSatisfier(null).test(undefined as any))
  t.false(createSatisfier(null).test(0))
  t.false(createSatisfier(null).test(false))
  t.false(createSatisfier(null).test(''))
})


test('mismatch value fails', t => {
  t.false(createSatisfier({ a: 1 }).test({ a: 2 }))
  t.false(createSatisfier({ a: true }).test({ a: false }))
  t.false(createSatisfier({ a: 'a' }).test({ a: 'b' }))
  t.false(createSatisfier({ a: /foo/ }).test({ a: 'b' }))
  t.false(createSatisfier({ a: () => false }).test({ a: 'b' }))
  t.false(createSatisfier([{ a: 1 }, { b: 2 }]).test([{ a: true }, { b: 'b' }, { c: 3 }]))
  t.false(createSatisfier({ a: [1, true, 'a'] }).test({ a: [1, true, 'b'] }))
  t.false(createSatisfier({ a: { b: 1 } }).test({ a: { b: 2 } }))
})
