import t from 'assert';
import a from 'assertron';
import { createSatisfier } from '.';
import { assertDiff, assertRegExp } from './testUtil';

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
  assertDiff(actual[0], ['a'], {}, undefined)
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

test('NaN satisfies NaN', () => {
  t(createSatisfier(NaN).test(NaN))
})

test('NaN not satisfies others', () => {
  a.false(createSatisfier(NaN).test(`a`))
  a.false(createSatisfier(NaN).test(true))
  a.false(createSatisfier(NaN).test(1))
  a.false(createSatisfier(NaN).test([]))
  a.false(createSatisfier(NaN).test({}))
})

test('array with NaN', () => {
  t(createSatisfier([NaN]).test([NaN]))
  a.false(createSatisfier([NaN]).test([1]))
})

describe('exec', () => {
  test('undefined should match anything', () => {
    t.strictEqual(createSatisfier(undefined).exec(undefined), undefined)
    t.strictEqual(createSatisfier(undefined).exec({}), undefined)
    t.strictEqual(createSatisfier({ a: undefined }).exec({}), undefined)
    t.strictEqual(createSatisfier([undefined]).exec([]), undefined)
  })

  test('primitive types without specifing generic will work without issue.', () => {
    t.strictEqual(createSatisfier(1).exec(1), undefined)
    t.strictEqual(createSatisfier(true).exec(true), undefined)
    t.strictEqual(createSatisfier('a').exec('a'), undefined)
  })

  test('can use generic to specify the data structure', () => {
    t.strictEqual(createSatisfier<number>(1).exec(1), undefined)
    t.strictEqual(createSatisfier<{ a: number }>({ a: /1/ }).exec({ a: 1 }), undefined)
  })

  test('empty object expectation passes all objects', () => {
    t.strictEqual(createSatisfier({}).exec({}), undefined)
    t.strictEqual(createSatisfier({}).exec({ a: 1 }), undefined)
    t.strictEqual(createSatisfier({}).exec({ a: { b: 'a' } }), undefined)
    t.strictEqual(createSatisfier({}).exec({ a: true }), undefined)
    t.strictEqual(createSatisfier({}).exec({ a: [1] }), undefined)
  })

  test('empty object expectation fails primitive', () => {
    assertDiff(createSatisfier({}).exec(1)![0], [], {}, 1)
    assertDiff(createSatisfier({}).exec(true)![0], [], {}, true)
    assertDiff(createSatisfier({}).exec('a')![0], [], {}, 'a')
  })

  test('mismatch value gets path, expected, and actual', () => {
    const actual = createSatisfier({ a: 1 }).exec({ a: 2 })!
    t.strictEqual(actual.length, 1)
    assertDiff(actual[0], ['a'], 1, 2)
  })

  test('missing property get actual as undefined', () => {
    const actual = createSatisfier({ a: 1 }).exec({})!
    t.strictEqual(actual.length, 1)
    assertDiff(actual[0], ['a'], 1, undefined)
  })

  test('missing property get deeper level', () => {
    const actual = createSatisfier({ a: { b: 1 } }).exec({ a: {} })!
    t.strictEqual(actual.length, 1)
    assertDiff(actual[0], ['a', 'b'], 1, undefined)
  })

  test('passing regex gets undefined', () => {
    t.strictEqual(createSatisfier({ foo: /foo/ }).exec({ foo: 'foo' }), undefined)
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
    t.strictEqual(createSatisfier({ a: (a: any) => a === 1 }).exec({ a: 1 }), undefined)
  })

  test('passing predicate gets undefined', () => {
    t.strictEqual(createSatisfier({ a: () => true }).exec({}), undefined)
    t.strictEqual(createSatisfier({ a: () => true }).exec({ a: 1 }), undefined)
  })

  test('failing predicate', () => {
    const actual = createSatisfier({ a: /*istanbul ignore next*/function () { return false } }).exec({ a: 1 })!
    t.strictEqual(actual.length, 1)
    assertDiff(actual[0], ['a'], /*istanbul ignore next*/function () { return false; }, 1)
  })

  test('against each element in array', () => {
    t.strictEqual(createSatisfier({ a: 1 }).exec([{ a: 1 }, { b: 1, a: 1 }]), undefined)
  })

  test('against each element in array in deep level', () => {
    const actual = createSatisfier({ a: { b: { c: /foo/ } } }).exec([{ a: {} }, { a: { b: {} } }, { a: { b: { c: 'boo' } } }])!
    t.strictEqual(actual.length, 3)
    assertDiff(actual[0], ['[0]', 'a', 'b'], { c: /foo/ }, undefined)
    assertDiff(actual[1], ['[1]', 'a', 'b', 'c'], /foo/, undefined)
    assertDiff(actual[2], ['[2]', 'a', 'b', 'c'], /foo/, 'boo')
  })

  test('when apply against array, will have indices in the path', () => {
    const actual = createSatisfier({ a: 1 }).exec([{ a: 1 }, {}])!
    t.strictEqual(actual.length, 1)
    assertDiff(actual[0], ['[1]', 'a'], 1, undefined)
  })

  test('when expectation is an array, apply to each entry in the actual array', () => {
    t.strictEqual(createSatisfier([{ a: 1 }, { b: 2 }]).exec([{ a: 1 }, { b: 2 }]), undefined)
    const actual = createSatisfier([{ a: 1 }, { b: 2 }]).exec([{ a: true }, { b: 'b' }])!
    t.strictEqual(actual.length, 2)
    assertDiff(actual[0], ['[0]', 'a'], 1, true)
    assertDiff(actual[1], ['[1]', 'b'], 2, 'b')
  })

  test.skip('when expectation is an array and actual is not, the behavior is not defined yet', () => {
    const actual = createSatisfier([{ a: 1 }, { b: 2 }]).exec({ a: 1 })!
    t.strictEqual(actual.length, 1)
  })

  test('deep object checking', () => {
    const actual = createSatisfier({ a: { b: 1 } }).exec({ a: { b: 2 } })!
    t.strictEqual(actual.length, 1)
    assertDiff(actual[0], ['a', 'b'], 1, 2)
  })

  test('can check parent property', () => {
    class Foo {
      foo = 'foo'
    }
    class Boo extends Foo {
      boo = 'boo'
    }
    const boo = new Boo()
    t.strictEqual(createSatisfier({ foo: 'foo' }).exec(boo), undefined)
  })

  test('actual of type any should not have type checking error', () => {
    let actual: any = { a: 1 }
    t.strictEqual(createSatisfier({ a: 1 }).exec(actual), undefined)
  })

  test('expect array in hash', () => {
    t.strictEqual(createSatisfier({ a: [1, true, 'a'] }).exec({ a: [1, true, 'a'] }), undefined)
  })

  test('failing array in hash', () => {
    const actual = createSatisfier({ a: [1, true, 'a'] }).exec({ a: [1, true, 'b'] })!
    t.strictEqual(actual.length, 1)
    assertDiff(actual[0], ['a', '[2]'], 'a', 'b')
  })

  test('apply property predicate to array', () => {
    const satisfier = createSatisfier({
      data: (e: any) => e && e.every((x: any) => x.login)
    });

    t.strictEqual(satisfier.exec({ data: [{ login: 'a' }] }), undefined)
    t.notStrictEqual(satisfier.exec([{ data: [{ foo: 'a' }] }]), undefined)
    t.notStrictEqual(satisfier.exec([{ foo: 'b' }]), undefined)
  })
})

describe('test', () => {
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
    t(createSatisfier((e: any) => {
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
    t(createSatisfier({ a: (e: any) => typeof e === 'string' })
      .test([{ a: 'a' }, { a: 'b' }]))
  })
})
