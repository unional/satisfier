import { test } from 'ava'

import { createSatisfier } from './index'
import { assertExec, assertRegExp } from './testUtil'

test('primitive types without specifing generic will work without issue.', t => {
  t.is(createSatisfier(1).exec(1), undefined)
  t.is(createSatisfier(true).exec(true), undefined)
  t.is(createSatisfier('a').exec('a'), undefined)
})

test('can use generic to specify the data structure', t => {
  t.is(createSatisfier<number>(1).exec(1), undefined)
  t.is(createSatisfier<{ a: number }>({ a: /1/ }).exec({ a: 1 }), undefined)
})

test('empty object expecter passes all objects', t => {
  t.is(createSatisfier({}).exec({}), undefined)
  t.is(createSatisfier({}).exec({ a: 1 }), undefined)
  t.is(createSatisfier({}).exec({ a: { b: 'a' } }), undefined)
  t.is(createSatisfier({}).exec({ a: true }), undefined)
  t.is(createSatisfier({}).exec({ a: [1] }), undefined)
})

test('empty object expecter fails primitive', t => {
  assertExec(t, createSatisfier({}).exec(1)![0], [], {}, 1)
  assertExec(t, createSatisfier({}).exec(true)![0], [], {}, true)
  assertExec(t, createSatisfier({}).exec('a')![0], [], {}, 'a')
})

test('mismatch value gets path, expected, and actual', t => {
  const actual = createSatisfier({ a: 1 }).exec({ a: 2 })!
  t.is(actual.length, 1)
  assertExec(t, actual[0], ['a'], 1, 2)
})

test('missing property get actual as undefined', t => {
  const actual = createSatisfier({ a: 1 }).exec({})!
  t.is(actual.length, 1)
  assertExec(t, actual[0], ['a'], 1, undefined)
})

test('missing property get deeper level', t => {
  const actual = createSatisfier({ a: { b: 1 } }).exec({ a: {} })!
  t.is(actual.length, 1)
  assertExec(t, actual[0], ['a', 'b'], 1, undefined)
})

test('passing regex gets undefined', t => {
  t.is(createSatisfier({ foo: /foo/ }).exec({ foo: 'foo' }), undefined)
})

test('failed regex will be in expected property', t => {
  const actual = createSatisfier({ foo: /foo/ }).exec({ foo: 'boo' })!
  assertRegExp(t, actual, ['foo'], /foo/, 'boo')
})

test('regex on missing property gets actual as undefined', t => {
  const actual = createSatisfier({ foo: /foo/ }).exec({})!
  assertRegExp(t, actual, ['foo'], /foo/, undefined)
})

test('regex on non-string will fail as normal', t => {
  let actual = createSatisfier({ foo: /foo/ }).exec({ foo: 1 })!
  assertRegExp(t, actual, ['foo'], /foo/, 1)

  actual = createSatisfier({ foo: /foo/ }).exec({ foo: true })!
  assertRegExp(t, actual, ['foo'], /foo/, true)

  actual = createSatisfier({ foo: /foo/ }).exec({ foo: [1, true, 'a'] })!
  assertRegExp(t, actual, ['foo'], /foo/, [1, true, 'a'])

  actual = createSatisfier({ foo: /foo/ }).exec({ foo: { a: 1 } })!
  assertRegExp(t, actual, ['foo'], /foo/, { a: 1 })
})

test('predicate receives actual value', t => {
  t.is(createSatisfier({ a: a => a === 1 }).exec({ a: 1 }), undefined)
})

test('passing predicate gets undefined', t => {
  t.is(createSatisfier({ a: () => true }).exec({}), undefined)
  t.is(createSatisfier({ a: () => true }).exec({ a: 1 }), undefined)
})

test('failing predicate', t => {
  const actual = createSatisfier({ a: /*istanbul ignore next*/function () { return false } }).exec({ a: 1 })!
  t.is(actual.length, 1)
  assertExec(t, actual[0], ['a'], /*istanbul ignore next*/function () { return false; }, 1)
})

test('against each element in array', t => {
  t.is(createSatisfier({ a: 1 }).exec([{ a: 1 }, { b: 1, a: 1 }]), undefined)
})

test('against each element in array in deep level', t => {
  const actual = createSatisfier({ a: { b: { c: /foo/ } } }).exec([{ a: {} }, { a: { b: {} } }, { a: { b: { c: 'boo' } } }])!
  t.is(actual.length, 3)
  assertExec(t, actual[0], ['[0]', 'a', 'b'], { c: /foo/ }, undefined)
  assertExec(t, actual[1], ['[1]', 'a', 'b', 'c'], /foo/, undefined)
  assertExec(t, actual[2], ['[2]', 'a', 'b', 'c'], /foo/, 'boo')
})

test('when apply against array, will have indices in the path', t => {
  const actual = createSatisfier({ a: 1 }).exec([{ a: 1 }, {}])!
  t.is(actual.length, 1)
  assertExec(t, actual[0], ['[1]', 'a'], 1, undefined)
})

test('when Expecter is an array, will apply to each entry in the actual array', t => {
  t.is(createSatisfier([{ a: 1 }, { b: 2 }]).exec([{ a: 1 }, { b: 2 }, { c: 3 }]), undefined)
  const actual = createSatisfier([{ a: 1 }, { b: 2 }]).exec([{ a: true }, { b: 'b' }, { c: 3 }])!
  t.is(actual.length, 2)
  assertExec(t, actual[0], ['[0]', 'a'], 1, true)
  assertExec(t, actual[1], ['[1]', 'b'], 2, 'b')
})

test.skip('when Expecter is an array and actual is not, the behavior is not defined yet', t => {
  const actual = createSatisfier([{ a: 1 }, { b: 2 }]).exec({ a: 1 })!
  t.is(actual.length, 1)
})

test('deep object checking', t => {
  const actual = createSatisfier({ a: { b: 1 } }).exec({ a: { b: 2 } })!
  t.is(actual.length, 1)
  assertExec(t, actual[0], ['a', 'b'], 1, 2)
})

test('can check parent property', t => {
  class Foo {
    foo = 'foo'
  }
  class Boo extends Foo {
    boo = 'boo'
  }
  const boo = new Boo()
  t.is(createSatisfier({ foo: 'foo' }).exec(boo), undefined)
})

test('actual of type any should not have type checking error', t => {
  let actual: any = { a: 1 }
  t.is(createSatisfier({ a: 1 }).exec(actual), undefined)
})

test('expect array in hash', t => {
  t.is(createSatisfier({ a: [1, true, 'a'] }).exec({ a: [1, true, 'a'] }), undefined)
})

test('failing array in hash', t => {
  // console.log(Object.keys(['a', 'b', 'c']))
  const actual = createSatisfier({ a: [1, true, 'a'] }).exec({ a: [1, true, 'b'] })!
  t.is(actual.length, 1)
  assertExec(t, actual[0], ['a', '[2]'], 'a', 'b')
})

test('apply expectation function to each element in array', t => {
  const satisfier = createSatisfier(e => e.login)
  t.is(satisfier.exec([{ login: 'a' }]), undefined)
  t.not(satisfier.exec([{ foo: 'a' }]), undefined)
})

test('apply property predicate to each element in array', t => {
  const satisfier = createSatisfier({ data: e => e && e.login });

  t.is(satisfier.exec({ data: { login: 'a' } }), undefined)
  t.is(satisfier.exec({ data: [{ login: 'a' }] }), undefined)
  const actual = satisfier.exec({ data: [{ login: 'a' }, {}] })!
  t.true(createSatisfier({ path: ['data', '[1]'], actual: {} }).test(actual[0]))
  t.not(satisfier.exec([{ data: { foo: 'a' } }]), undefined)
  t.not(satisfier.exec([{ foo: 'b' }]), undefined)
})
