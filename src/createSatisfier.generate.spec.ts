import { isInRange } from './isInRange';
import { test } from 'ava'

import { createSatisfier } from './index'

test('generate primitives', t => {
  t.deepEqual(createSatisfier(1).generate(), 1)
  t.deepEqual(createSatisfier(true).generate(), true)
  t.deepEqual(createSatisfier('a').generate(), 'a')
})


test('generate simple object', t => {
  t.deepEqual(createSatisfier({ a: 1 }).generate(), { a: 1 })
  t.deepEqual(createSatisfier({ a: 1, b: true, c: 'c' }).generate(), { a: 1, b: true, c: 'c' })
  t.deepEqual(createSatisfier({ a: { b: { c: 1 } } }).generate(), { a: { b: { c: 1 } } })

  const expecter = { a: 1 }
  t.not(createSatisfier(expecter).generate(), expecter)
})

test('RegExp creates example', t => {
  const actual = createSatisfier(/foo/).generate() as string

  t.is(typeof actual, 'string')
  t.true(/foo/.test(actual))
})

test('work with deep RegExp', t => {
  const actual = createSatisfier({ a: { b: { c: /foo/ } } }).generate() as any

  t.is(typeof actual.a.b.c, 'string')
  t.true(/foo/.test(actual.a.b.c))
})

test('static predicate receives undefined', t => {
  const actual = createSatisfier(() => true).generate()
  t.is(typeof actual, 'undefined')
})

test.skip('number predicate', t => {
  const actual = createSatisfier(a => a > 0).generate()
  t.is(typeof actual, 'number')
})


test.skip('predicate with overridden toString()', t => {
  const actual = createSatisfier(isInRange(1, 3)).generate()
  t.is(typeof actual, 'number')
})
