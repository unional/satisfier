import { test } from 'ava'

import { createSatisfier } from './index'
import { assertExec } from './testUtil'

test('support generics', t => {
  const s = createSatisfier<{ a: number }>({ a: 1 })
  t.true(s.test({ a: 1 }))
  t.false(s.test({ a: 2 }))
})

test('Expecter can be specify partial of the data structure', t => {
  createSatisfier<{ a: number, b: string }>({ a: 1 })
  createSatisfier<{ a: number, b: string }>([{ a: 1 }])
  createSatisfier<{ a: { c: number, d: string }, b: string }>({ a: {} })
  createSatisfier<{ a: { c: number, d: string }, b: string }>([{ a: {} }, { b: /a/ }, { a: { c: 1 } }])
  t.pass()
})

test('nested {} checks for non undefined', t => {
  const s = createSatisfier<{ a: { c: number, d: string }, b: string }>({ a: {} })
  const actual = s.exec({} as any)!
  t.is(actual.length, 1)
  assertExec(t, actual[0], ['a'], {}, undefined)
})

test('actual should be a complete struct', t => {
  const s = createSatisfier<{ a: number, b: string }>({ a: 1, b: 'b' })

  // missing `b`
  // t.true(s.test({ a: 1 }))
  t.true(s.test({ a: 1, b: 'b' }))
})

test('expect null', t => {
  t.true(createSatisfier(null).test(null))
})

test('expect [undefined]', t => {
  t.true(createSatisfier([undefined]).test([undefined]))
})

test('expect [undefined] should work with [null]', t => {
  t.false(createSatisfier([undefined]).test([null]))
})

test('expect array and test against non-array', t => {
  const s = createSatisfier([1])
  t.false(s.test(null))
  t.false(s.test(1))
  t.false(s.test('a'))
  t.false(s.test(true))
  t.false(s.test(undefined as any))
})

test('array with number', t => {
  t.true(createSatisfier([1, 2]).test([1, 2]))
})

test('array with null', t => {
  t.true(createSatisfier([null]).test([null]))
  t.false(createSatisfier([null]).test([1]))
})
