import t from 'assert'
import a from 'assertron'

import { createSatisfier } from './index'
import { assertExec } from './testUtil'

test('support generics', () => {
  const s = createSatisfier<{ a: number }>({ a: 1 })
  t(s.test({ a: 1 }))
  a.false(s.test({ a: 2 }))
})

test('Expecter can be specify partial of the data structure', () => {
  createSatisfier<{ a: number, b: string }>({ a: 1 })
  createSatisfier<{ a: number, b: string }>([{ a: 1 }])
  createSatisfier<{ a: { c: number, d: string }, b: string }>({ a: {} })
  createSatisfier<{ a: { c: number, d: string }, b: string }>([{ a: {} }, { b: /a/ }, { a: { c: 1 } }])
})

test('nested {} checks for non undefined', () => {
  const s = createSatisfier<{ a: { c: number, d: string }, b: string }>({ a: {} })
  const actual = s.exec({} as any)!
  t.strictEqual(actual.length, 1)
  assertExec(actual[0], ['a'], {}, undefined)
})

test('actual should be a complete struct', () => {
  const s = createSatisfier<{ a: number, b: string }>({ a: 1, b: 'b' })

  // missing `b`
  // t.true(s.test({ a: 1 }))
  t(s.test({ a: 1, b: 'b' }))
})

test('expect array and test against non-array', () => {
  const s = createSatisfier([1])
  a.false(s.test(null))
  a.false(s.test(1))
  a.false(s.test('a'))
  a.false(s.test(true))
  a.false(s.test(undefined as any))
})

test('array with number', () => {
  t(createSatisfier([1, 2]).test([1, 2]))
})

test('array with null', () => {
  t(createSatisfier([null]).test([null]))
  a.false(createSatisfier([null]).test([1]))
})
