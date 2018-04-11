import t from 'assert'
import a from 'assertron'

import { createSatisfier } from './index'

test('empty expecter passes everything but not null or undefined', () => {
  t(createSatisfier({}).test({}))
  t(createSatisfier({}).test({ a: 1 }))
  t(createSatisfier({}).test({ a: true }))
  t(createSatisfier({}).test({ a: 'a' }))
  t(createSatisfier({}).test({ a: [1, true, 'a'] }))
  t(createSatisfier({}).test({ a: { b: 'a' } }))
  t(createSatisfier({}).test([{}, { a: 1 }]))
  a.false(createSatisfier({}).test(null))
  a.false(createSatisfier({}).test(undefined as any))
})

test('expect null to pass only null', () => {
  t(createSatisfier(null).test(null))
  a.false(createSatisfier(null).test(undefined as any))
  a.false(createSatisfier(null).test(0))
  a.false(createSatisfier(null).test(false))
  a.false(createSatisfier(null).test(''))
})

test('mismatch value fails', () => {
  a.false(createSatisfier({ a: 1 }).test({ a: 2 }))
  a.false(createSatisfier({ a: true }).test({ a: false }))
  a.false(createSatisfier({ a: 'a' }).test({ a: 'b' }))
  a.false(createSatisfier({ a: /foo/ }).test({ a: 'b' }))
  a.false(createSatisfier({ a: () => false }).test({ a: 'b' }))
  a.false(createSatisfier([{ a: 1 }, { b: 2 }]).test([{ a: true }, { b: 'b' }, { c: 3 }]))
  a.false(createSatisfier({ a: [1, true, 'a'] }).test({ a: [1, true, 'b'] }))
  a.false(createSatisfier({ a: { b: 1 } }).test({ a: { b: 2 } }))
})

test('undefined expectation are ignored', () => {
  const s = createSatisfier([undefined, 1])
  t(s.test([undefined, 1]))
  t(s.test([null, 1]))
  t(s.test([1, 1]))
  t(s.test(['a', 1]))
  t(s.test([true, 1]))
  t(s.test([{ a: 1 }, 1]))
  t(s.test([[1, 2], 1]))
})

test('undefined expectation are ignored', () => {
  const s = createSatisfier({ a: [undefined, 1] })
  t(s.test({ a: [undefined, 1] }))
  t(s.test({ a: [null, 1] }))
  t(s.test({ a: [1, 1] }))
  t(s.test({ a: ['a', 1] }))
  t(s.test({ a: [true, 1] }))
  t(s.test({ a: [{ a: 1 }, 1] }))
  t(s.test({ a: [[1, 2], 1] }))
})

test('predicate receives array', () => {
  t(createSatisfier(e => {
    return e[0] === 'a' && e[1] === 'b'
  }).test(['a', 'b']))
})

test('primitive predicate will check against element in array', () => {
  t(createSatisfier(1).test([1, 1]))
  a.false(createSatisfier(1).test([1, 2]))
  t(createSatisfier(false).test([false, false]))
  a.false(createSatisfier(false).test([false, true]))
  t(createSatisfier('a').test(['a', 'a']))
  a.false(createSatisfier('a').test(['a', 'b']))
})


test('object predicate will check against element in array', () => {
  t(createSatisfier({ a: 1 }).test([{ a: 1 }, { a: 1 }]))
  t(createSatisfier({ a: e => typeof e === 'string' })
    .test([{ a: 'a' }, { a: 'b' }]))
})
