import t from 'assert'

import { createSatisfier } from './index'
import { assertExec, assertRegExp } from './testUtil'

test('undefined should match anything', () => {
  t.equal(createSatisfier(undefined).exec(undefined), undefined)
  t.equal(createSatisfier(undefined).exec({}), undefined)
  t.equal(createSatisfier({ a: undefined }).exec({}), undefined)
  t.equal(createSatisfier([undefined]).exec([]), undefined)
})

test('primitive types without specifing generic will work without issue.', () => {
  t.equal(createSatisfier(1).exec(1), undefined)
  t.equal(createSatisfier(true).exec(true), undefined)
  t.equal(createSatisfier('a').exec('a'), undefined)
})

test('can use generic to specify the data structure', () => {
  t.equal(createSatisfier<number>(1).exec(1), undefined)
  t.equal(createSatisfier<{ a: number }>({ a: /1/ }).exec({ a: 1 }), undefined)
})

test('empty object expectation passes all objects', () => {
  t.equal(createSatisfier({}).exec({}), undefined)
  t.equal(createSatisfier({}).exec({ a: 1 }), undefined)
  t.equal(createSatisfier({}).exec({ a: { b: 'a' } }), undefined)
  t.equal(createSatisfier({}).exec({ a: true }), undefined)
  t.equal(createSatisfier({}).exec({ a: [1] }), undefined)
})

test('empty object expectation fails primitive', () => {
  assertExec(createSatisfier({}).exec(1)![0], [], {}, 1)
  assertExec(createSatisfier({}).exec(true)![0], [], {}, true)
  assertExec(createSatisfier({}).exec('a')![0], [], {}, 'a')
})

test('mismatch value gets path, expected, and actual', () => {
  const actual = createSatisfier({ a: 1 }).exec({ a: 2 })!
  t.equal(actual.length, 1)
  assertExec(actual[0], ['a'], 1, 2)
})

test('missing property get actual as undefined', () => {
  const actual = createSatisfier({ a: 1 }).exec({})!
  t.equal(actual.length, 1)
  assertExec(actual[0], ['a'], 1, undefined)
})

test('missing property get deeper level', () => {
  const actual = createSatisfier({ a: { b: 1 } }).exec({ a: {} })!
  t.equal(actual.length, 1)
  assertExec(actual[0], ['a', 'b'], 1, undefined)
})

test('passing regex gets undefined', () => {
  t.equal(createSatisfier({ foo: /foo/ }).exec({ foo: 'foo' }), undefined)
})

test('failed regex will be in expected property', () => {
  const actual = createSatisfier({ foo: /foo/ }).exec({ foo: 'boo' })!
  assertRegExp(actual, ['foo'], /foo/, 'boo')
})

test('regex on missing property gets actual as undefined', () => {
  const actual = createSatisfier({ foo: /foo/ }).exec({})!
  assertRegExp(actual, ['foo'], /foo/, undefined)
})

test('regex on non-string will fail as normal', () => {
  let actual = createSatisfier({ foo: /foo/ }).exec({ foo: 1 })!
  assertRegExp(actual, ['foo'], /foo/, 1)

  actual = createSatisfier({ foo: /foo/ }).exec({ foo: true })!
  assertRegExp(actual, ['foo'], /foo/, true)

  actual = createSatisfier({ foo: /foo/ }).exec({ foo: [1, true, 'a'] })!
  assertRegExp(actual, ['foo'], /foo/, [1, true, 'a'])

  actual = createSatisfier({ foo: /foo/ }).exec({ foo: { a: 1 } })!
  assertRegExp(actual, ['foo'], /foo/, { a: 1 })
})

test('predicate receives actual value', () => {
  t.equal(createSatisfier({ a: a => a === 1 }).exec({ a: 1 }), undefined)
})

test('passing predicate gets undefined', () => {
  t.equal(createSatisfier({ a: () => true }).exec({}), undefined)
  t.equal(createSatisfier({ a: () => true }).exec({ a: 1 }), undefined)
})

test('failing predicate', () => {
  const actual = createSatisfier({ a: /*istanbul ignore next*/function () { return false } }).exec({ a: 1 })!
  t.equal(actual.length, 1)
  assertExec(actual[0], ['a'], /*istanbul ignore next*/function () { return false; }, 1)
})

test('against each element in array', () => {
  t.equal(createSatisfier({ a: 1 }).exec([{ a: 1 }, { b: 1, a: 1 }]), undefined)
})

test('against each element in array in deep level', () => {
  const actual = createSatisfier({ a: { b: { c: /foo/ } } }).exec([{ a: {} }, { a: { b: {} } }, { a: { b: { c: 'boo' } } }])!
  t.equal(actual.length, 3)
  assertExec(actual[0], ['[0]', 'a', 'b'], { c: /foo/ }, undefined)
  assertExec(actual[1], ['[1]', 'a', 'b', 'c'], /foo/, undefined)
  assertExec(actual[2], ['[2]', 'a', 'b', 'c'], /foo/, 'boo')
})

test('when apply against array, will have indices in the path', () => {
  const actual = createSatisfier({ a: 1 }).exec([{ a: 1 }, {}])!
  t.equal(actual.length, 1)
  assertExec(actual[0], ['[1]', 'a'], 1, undefined)
})

test('when expectation is an array, apply to each entry in the actual array', () => {
  t.equal(createSatisfier([{ a: 1 }, { b: 2 }]).exec([{ a: 1 }, { b: 2 }, { c: 3 }]), undefined)
  const actual = createSatisfier([{ a: 1 }, { b: 2 }]).exec([{ a: true }, { b: 'b' }, { c: 3 }])!
  t.equal(actual.length, 2)
  assertExec(actual[0], ['[0]', 'a'], 1, true)
  assertExec(actual[1], ['[1]', 'b'], 2, 'b')
})

test.skip('when expectation is an array and actual is not, the behavior is not defined yet', () => {
  const actual = createSatisfier([{ a: 1 }, { b: 2 }]).exec({ a: 1 })!
  t.equal(actual.length, 1)
})

test('deep object checking', () => {
  const actual = createSatisfier({ a: { b: 1 } }).exec({ a: { b: 2 } })!
  t.equal(actual.length, 1)
  assertExec(actual[0], ['a', 'b'], 1, 2)
})

test('can check parent property', () => {
  class Foo {
    foo = 'foo'
  }
  class Boo extends Foo {
    boo = 'boo'
  }
  const boo = new Boo()
  t.equal(createSatisfier({ foo: 'foo' }).exec(boo), undefined)
})

test('actual of type any should not have type checking error', () => {
  let actual: any = { a: 1 }
  t.equal(createSatisfier({ a: 1 }).exec(actual), undefined)
})

test('expect array in hash', () => {
  t.equal(createSatisfier({ a: [1, true, 'a'] }).exec({ a: [1, true, 'a'] }), undefined)
})

test('failing array in hash', () => {
  const actual = createSatisfier({ a: [1, true, 'a'] }).exec({ a: [1, true, 'b'] })!
  t.equal(actual.length, 1)
  assertExec(actual[0], ['a', '[2]'], 'a', 'b')
})

test('apply property predicate to array', () => {
  const satisfier = createSatisfier({
    data: e => e && e.every(x => x.login)
  });

  t.equal(satisfier.exec({ data: [{ login: 'a' }] }), undefined)
  t.notEqual(satisfier.exec([{ data: [{ foo: 'a' }] }]), undefined)
  t.notEqual(satisfier.exec([{ foo: 'b' }]), undefined)
})
