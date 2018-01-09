import { test } from 'ava'

import { createSatisfier } from './index'

test('empty expecter passes everything', t => {
  t.true(createSatisfier({}).test({}))
  t.true(createSatisfier({}).test({ a: 1 }))
  t.true(createSatisfier({}).test({ a: true }))
  t.true(createSatisfier({}).test({ a: 'a' }))
  t.true(createSatisfier({}).test({ a: [1, true, 'a'] }))
  t.true(createSatisfier({}).test({ a: { b: 'a' } }))
  t.true(createSatisfier({}).test([{}, { a: 1 }]))
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
