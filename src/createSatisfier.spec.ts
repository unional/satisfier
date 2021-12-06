import { assertType } from 'type-plus'
import { anything, createSatisfier } from '.'

const testSymbol = Symbol()
const testArrow = () => true
const testFn = function () { return true }
describe('anything', () => {
  test('matches against anything', () => {
    const s = createSatisfier(anything)
    expect(s.exec(undefined)).toBeUndefined()
    expect(s.exec(null)).toBeUndefined()
    expect(s.exec(false)).toBeUndefined()
    expect(s.exec(1)).toBeUndefined()
    expect(s.exec(1n)).toBeUndefined()
    expect(s.exec('a')).toBeUndefined()
    expect(s.exec(Symbol())).toBeUndefined()
    expect(s.exec({})).toBeUndefined()
    expect(s.exec([])).toBeUndefined()
    expect(s.exec(testFn)).toBeUndefined()
    expect(s.exec(testArrow)).toBeUndefined()
  })
})

describe('undefined', () => {
  test('matches only undefined', () => {
    const s = createSatisfier(undefined)
    expect(s.exec(undefined)).toBeUndefined()

    expect(s.exec(null)).toEqual([{ path: [], expected: undefined, actual: null }])
    expect(s.exec(true)).toEqual([{ path: [], expected: undefined, actual: true }])
    expect(s.exec(1)).toEqual([{ path: [], expected: undefined, actual: 1 }])
    expect(s.exec(1n)).toEqual([{ path: [], expected: undefined, actual: 1n }])
    expect(s.exec('a')).toEqual([{ path: [], expected: undefined, actual: 'a' }])
    expect(s.exec(testSymbol)).toEqual([{ path: [], expected: undefined, actual: testSymbol }])
    expect(s.exec(/foo/)).toEqual([{ path: [], expected: undefined, actual: /foo/ }])
    expect(s.exec({})).toEqual([{ path: [], expected: undefined, actual: {} }])
    expect(s.exec([])).toEqual([{ path: [], expected: undefined, actual: [] }])
    expect(s.exec(testFn)).toEqual([{ path: [], expected: undefined, actual: testFn }])
    expect(s.exec(testArrow)).toEqual([{ path: [], expected: undefined, actual: testArrow }])
  })
})

describe('null', () => {
  test('matches only null', () => {
    const s = createSatisfier(null)

    expect(s.exec(undefined)).toEqual([{ path: [], expected: null, actual: undefined }])
    expect(s.exec(null)).toBeUndefined()
    expect(s.exec(true)).toEqual([{ path: [], expected: null, actual: true }])
    expect(s.exec(1)).toEqual([{ path: [], expected: null, actual: 1 }])
    expect(s.exec(1n)).toEqual([{ path: [], expected: null, actual: 1n }])
    expect(s.exec('a')).toEqual([{ path: [], expected: null, actual: 'a' }])
    expect(s.exec(testSymbol)).toEqual([{ path: [], expected: null, actual: testSymbol }])
    expect(s.exec(/foo/)).toEqual([{ path: [], expected: null, actual: /foo/ }])
    expect(s.exec({})).toEqual([{ path: [], expected: null, actual: {} }])
    expect(s.exec([])).toEqual([{ path: [], expected: null, actual: [] }])
    expect(s.exec(testFn)).toEqual([{ path: [], expected: null, actual: testFn }])
    expect(s.exec(testArrow)).toEqual([{ path: [], expected: null, actual: testArrow }])
  })
})

describe('boolean', () => {
  test.each([true, false])('%p matches only itself', (expected: boolean) => {
    const s = createSatisfier(expected)

    expect(s.exec(undefined)).toEqual([{ path: [], expected, actual: undefined }])
    expect(s.exec(null)).toEqual([{ path: [], expected, actual: null }])
    expect(s.exec(expected)).toBeUndefined()
    expect(s.exec(!expected)).toEqual([{ path: [], expected, actual: !expected }])
    expect(s.exec(1)).toEqual([{ path: [], expected, actual: 1 }])
    expect(s.exec(1n)).toEqual([{ path: [], expected, actual: 1n }])
    expect(s.exec('a')).toEqual([{ path: [], expected, actual: 'a' }])
    expect(s.exec(testSymbol)).toEqual([{ path: [], expected, actual: testSymbol }])
    expect(s.exec(/foo/)).toEqual([{ path: [], expected, actual: /foo/ }])
    expect(s.exec({})).toEqual([{ path: [], expected, actual: {} }])
    expect(s.exec([])).toEqual([{ path: [], expected, actual: [] }])
    expect(s.exec(testFn)).toEqual([{ path: [], expected, actual: testFn }])
    expect(s.exec(testArrow)).toEqual([{ path: [], expected, actual: testArrow }])
  })
})

describe('number', () => {
  test.each([-1, 0, 1])('%d matches exact number', (expected: number) => {
    const s = createSatisfier(expected)

    expect(s.exec(undefined)).toEqual([{ path: [], expected, actual: undefined }])
    expect(s.exec(null)).toEqual([{ path: [], expected, actual: null }])
    expect(s.exec(true)).toEqual([{ path: [], expected, actual: true }])
    expect(s.exec(expected)).toBeUndefined()
    expect(s.exec(expected - 1)).toEqual([{ path: [], expected, actual: expected - 1 }])
    expect(s.exec(expected + 1)).toEqual([{ path: [], expected, actual: expected + 1 }])
    expect(s.exec(String(expected))).toEqual([{ path: [], expected, actual: String(expected) }])
    expect(s.exec(expected)).toBeUndefined()
    expect(s.exec(String(expected))).toEqual([{ path: [], expected, actual: String(expected) }])
    expect(s.exec(testSymbol)).toEqual([{ path: [], expected, actual: testSymbol }])
    expect(s.exec(/foo/)).toEqual([{ path: [], expected, actual: /foo/ }])
    expect(s.exec({})).toEqual([{ path: [], expected, actual: {} }])
    expect(s.exec([])).toEqual([{ path: [], expected, actual: [] }])
    expect(s.exec(testFn)).toEqual([{ path: [], expected, actual: testFn }])
    expect(s.exec(testArrow)).toEqual([{ path: [], expected, actual: testArrow }])
  })

  test('NaN matches only NaN', () => {
    const s = createSatisfier(NaN)

    expect(s.exec(undefined)).toEqual([{ path: [], expected: NaN, actual: undefined }])
    expect(s.exec(null)).toEqual([{ path: [], expected: NaN, actual: null }])
    expect(s.exec(true)).toEqual([{ path: [], expected: NaN, actual: true }])
    expect(s.exec(NaN)).toBeUndefined()
    expect(s.exec(1)).toEqual([{ path: [], expected: NaN, actual: 1 }])
    expect(s.exec(0)).toEqual([{ path: [], expected: NaN, actual: 0 }])
    expect(s.exec(-1)).toEqual([{ path: [], expected: NaN, actual: -1 }])
    expect(s.exec(String(NaN))).toEqual([{ path: [], expected: NaN, actual: String(NaN) }])
    expect(s.exec(testSymbol)).toEqual([{ path: [], expected: NaN, actual: testSymbol }])
    expect(s.exec(/foo/)).toEqual([{ path: [], expected: NaN, actual: /foo/ }])
    expect(s.exec({})).toEqual([{ path: [], expected: NaN, actual: {} }])
    expect(s.exec([])).toEqual([{ path: [], expected: NaN, actual: [] }])
    expect(s.exec(testFn)).toEqual([{ path: [], expected: NaN, actual: testFn }])
    expect(s.exec(testArrow)).toEqual([{ path: [], expected: NaN, actual: testArrow }])
  })

  test('Infinity only matches Infinity', () => {
    const s = createSatisfier(Infinity)

    expect(s.exec(undefined)).toEqual([{ path: [], expected: Infinity, actual: undefined }])
    expect(s.exec(null)).toEqual([{ path: [], expected: Infinity, actual: null }])
    expect(s.exec(true)).toEqual([{ path: [], expected: Infinity, actual: true }])
    expect(s.exec(Infinity)).toBeUndefined()
    expect(s.exec(1)).toEqual([{ path: [], expected: Infinity, actual: 1 }])
    expect(s.exec(0)).toEqual([{ path: [], expected: Infinity, actual: 0 }])
    expect(s.exec(-1)).toEqual([{ path: [], expected: Infinity, actual: -1 }])
    expect(s.exec(String(Infinity))).toEqual([{ path: [], expected: Infinity, actual: String(Infinity) }])
    expect(s.exec(testSymbol)).toEqual([{ path: [], expected: Infinity, actual: testSymbol }])
    expect(s.exec(/foo/)).toEqual([{ path: [], expected: Infinity, actual: /foo/ }])
    expect(s.exec({})).toEqual([{ path: [], expected: Infinity, actual: {} }])
    expect(s.exec([])).toEqual([{ path: [], expected: Infinity, actual: [] }])
    expect(s.exec(testFn)).toEqual([{ path: [], expected: Infinity, actual: testFn }])
    expect(s.exec(testArrow)).toEqual([{ path: [], expected: Infinity, actual: testArrow }])
  })
})

describe('bigint', () => {
  test.each([-1n, 0n, 1n])('%d matches exact bigint', expected => {
    const s = createSatisfier(expected)

    expect(s.exec(undefined)).toEqual([{ path: [], expected, actual: undefined }])
    expect(s.exec(null)).toEqual([{ path: [], expected, actual: null }])
    expect(s.exec(true)).toEqual([{ path: [], expected, actual: true }])
    expect(s.exec(expected)).toBeUndefined()
    expect(s.exec(expected - 1n)).toEqual([{ path: [], expected, actual: expected - 1n }])
    expect(s.exec(expected + 1n)).toEqual([{ path: [], expected, actual: expected + 1n }])
    expect(s.exec(0)).toEqual([{ path: [], expected, actual: 0 }])
    expect(s.exec(1)).toEqual([{ path: [], expected, actual: 1 }])
    expect(s.exec(-1)).toEqual([{ path: [], expected, actual: -1 }])
    expect(s.exec(String(expected))).toEqual([{ path: [], expected, actual: String(expected) }])
    expect(s.exec(testSymbol)).toEqual([{ path: [], expected, actual: testSymbol }])
    expect(s.exec(/foo/)).toEqual([{ path: [], expected, actual: /foo/ }])
    expect(s.exec({})).toEqual([{ path: [], expected, actual: {} }])
    expect(s.exec([])).toEqual([{ path: [], expected, actual: [] }])
    expect(s.exec(testFn)).toEqual([{ path: [], expected, actual: testFn }])
    expect(s.exec(testArrow)).toEqual([{ path: [], expected, actual: testArrow }])
  })
})

describe('string', () => {
  test('matches only the same string', () => {
    const expected = 'foo'
    const s = createSatisfier(expected)

    expect(s.exec(undefined)).toEqual([{ path: [], expected, actual: undefined }])
    expect(s.exec(null)).toEqual([{ path: [], expected, actual: null }])
    expect(s.exec(true)).toEqual([{ path: [], expected, actual: true }])
    expect(s.exec(1)).toEqual([{ path: [], expected, actual: 1 }])
    expect(s.exec(1n)).toEqual([{ path: [], expected, actual: 1n }])
    expect(s.exec(expected)).toBeUndefined()
    expect(s.exec('boo')).toEqual([{ path: [], expected, actual: 'boo' }])
    expect(s.exec(testSymbol)).toEqual([{ path: [], expected, actual: testSymbol }])
    expect(s.exec(/foo/)).toEqual([{ path: [], expected, actual: /foo/ }])
    expect(s.exec({})).toEqual([{ path: [], expected, actual: {} }])
    expect(s.exec([])).toEqual([{ path: [], expected, actual: [] }])
    expect(s.exec(testFn)).toEqual([{ path: [], expected, actual: testFn }])
    expect(s.exec(testArrow)).toEqual([{ path: [], expected, actual: testArrow }])
  })
})

describe('symbol', () => {
  test('matches only the same symbol', () => {
    const expected = Symbol()
    const s = createSatisfier(expected)

    expect(s.exec(undefined)).toEqual([{ path: [], expected, actual: undefined }])
    expect(s.exec(null)).toEqual([{ path: [], expected, actual: null }])
    expect(s.exec(true)).toEqual([{ path: [], expected, actual: true }])
    expect(s.exec(1)).toEqual([{ path: [], expected, actual: 1 }])
    expect(s.exec(1n)).toEqual([{ path: [], expected, actual: 1n }])
    expect(s.exec('boo')).toEqual([{ path: [], expected, actual: 'boo' }])
    expect(s.exec(expected)).toBeUndefined()
    expect(s.exec(testSymbol)).toEqual([{ path: [], expected, actual: testSymbol }])
    expect(s.exec(/foo/)).toEqual([{ path: [], expected, actual: /foo/ }])
    expect(s.exec({})).toEqual([{ path: [], expected, actual: {} }])
    expect(s.exec([])).toEqual([{ path: [], expected, actual: [] }])
    expect(s.exec(testFn)).toEqual([{ path: [], expected, actual: testFn }])
    expect(s.exec(testArrow)).toEqual([{ path: [], expected, actual: testArrow }])
  })
})

describe('regex', () => {
  test('matches itself and strings that matches it', () => {
    const expected = /foo/
    const s = createSatisfier(expected)

    expect(s.exec(undefined)).toEqual([{ path: [], expected, actual: undefined }])
    expect(s.exec(null)).toEqual([{ path: [], expected, actual: null }])
    expect(s.exec(true)).toEqual([{ path: [], expected, actual: true }])
    expect(s.exec(1)).toEqual([{ path: [], expected, actual: 1 }])
    expect(s.exec(1n)).toEqual([{ path: [], expected, actual: 1n }])
    expect(s.exec('boo')).toEqual([{ path: [], expected, actual: 'boo' }])
    expect(s.exec(testSymbol)).toEqual([{ path: [], expected, actual: testSymbol }])
    expect(s.exec(/foo/)).toBeUndefined()
    expect(s.exec('foo')).toBeUndefined()
    expect(s.exec(/boo/)).toEqual([{ path: [], expected, actual: /boo/ }])
    expect(s.exec({})).toEqual([{ path: [], expected, actual: {} }])
    expect(s.exec([])).toEqual([{ path: [], expected, actual: [] }])
    expect(s.exec(testFn)).toEqual([{ path: [], expected, actual: testFn }])
    expect(s.exec(testArrow)).toEqual([{ path: [], expected, actual: testArrow }])
  })

  test('will not match non string and regex', () => {
    expect(createSatisfier(/1/).exec(1)).toEqual([{ path: [], expected: /1/, actual: 1 }])
    expect(createSatisfier(/true/).exec(true)).toEqual([{ path: [], expected: /true/, actual: true }])
    expect(createSatisfier(/undefined/).exec(undefined)).toEqual([{ path: [], expected: /undefined/, actual: undefined }])
    expect(createSatisfier(/null/).exec(null)).toEqual([{ path: [], expected: /null/, actual: null }])
    expect(createSatisfier(/{}/).exec({})).toEqual([{ path: [], expected: /{}/, actual: {} }])
    expect(createSatisfier(/foo/).exec(['foo'])).toEqual([{ path: [], expected: /foo/, actual: ['foo'] }])
  })

  test('missing property gets undefined', () => {
    expect(createSatisfier({ f: /1/ }).exec({})).toEqual([{ path: ['f'], expected: /1/, actual: undefined }])
  })
})

describe('object', () => {
  test('does not match non-object', () => {
    const expected = {}
    const s = createSatisfier(expected)

    expect(s.exec(undefined)).toEqual([{ path: [], expected, actual: undefined }])
    expect(s.exec(null)).toEqual([{ path: [], expected, actual: null }])
    expect(s.exec(true)).toEqual([{ path: [], expected, actual: true }])
    expect(s.exec(1)).toEqual([{ path: [], expected, actual: 1 }])
    expect(s.exec(1n)).toEqual([{ path: [], expected, actual: 1n }])
    expect(s.exec('boo')).toEqual([{ path: [], expected, actual: 'boo' }])
    expect(s.exec(testSymbol)).toEqual([{ path: [], expected, actual: testSymbol }])
    expect(s.exec(/boo/)).toEqual([{ path: [], expected, actual: /boo/ }])
    expect(s.exec(testFn)).toEqual([{ path: [], expected, actual: testFn }])
    expect(s.exec(testArrow)).toEqual([{ path: [], expected, actual: testArrow }])
  })

  test('empty object matches object with any properties', () => {
    const expected = {}
    const s = createSatisfier(expected)

    expect(s.exec({})).toBeUndefined()
    expect(s.exec({ a: 1 })).toBeUndefined()
  })

  test('diff mismatched properties with proper path', () => {
    expect(createSatisfier({ a: 1 }).exec({ a: 2 })).toEqual([{ actual: 2, expected: 1, path: ['a'] }])
    expect(createSatisfier({ a: undefined }).exec({ a: 2 })).toEqual([{ actual: 2, expected: undefined, path: ['a'] }])
    expect(createSatisfier({ a: { b: 1 } }).exec({ a: 2 })).toEqual([{ actual: 2, expected: { b: 1 }, path: ['a'] }])
    expect(createSatisfier({ a: { b: 1 } }).exec({ a: { b: 3 } })).toEqual([{ actual: 3, expected: 1, path: ['a', 'b'] }])
  })

  test('missing property is detected', () => {
    expect(createSatisfier({ a: {} }).exec({})).toEqual([{ actual: undefined, expected: {}, path: ['a'] }])
  })

  test('will not match array', () => {
    expect(createSatisfier({ a: 1 }).exec([{ a: 1 }, { b: 1, a: 1 }])).toEqual([{ 'actual': [{ 'a': 1 }, { 'a': 1, 'b': 1 }], 'expected': { 'a': 1 }, 'path': [] }])
  })


  test('drill down and compare each property', () => {
    expect(createSatisfier({ a: { b: { c: /foo/ } } }).exec({ a: { b: { c: 'boo' } } }))
      .toEqual([{ actual: 'boo', expected: /foo/, path: ['a', 'b', 'c'] }])
  })

  test('check against property in parent class', () => {
    class Foo {
      foo = 'foo'
    }
    class Boo extends Foo {
      boo = 'boo'
    }
    const boo = new Boo()
    expect(createSatisfier({ foo: 'foo' }).exec(boo)).toBeUndefined()
  })

  test('check exactly on property array', () => {
    const s = createSatisfier({ a: [1, true, 'a'] })
    expect(s.exec({ a: [1, true, 'a'] })).toBeUndefined()
    expect(s.exec({ a: [1, true, 'b'] })).toEqual([{ actual: 'b', expected: 'a', path: ['a', 2] }])
  })

  test('property predicate receives the whole array in that property', () => {
    const predicate = (e: any) => e && e.every((x: any) => x.login)
    const s = createSatisfier({
      data: predicate
    });

    expect(s.exec({ data: [{ login: 'a' }] })).toBeUndefined()
    expect(s.exec({ data: [{ login: 'a' }, { login: 'b' }] })).toBeUndefined()
    expect(s.exec({ data: [{ login: 'a' }, {}] })).toEqual([{ actual: [{ login: 'a' }, {}], expected: predicate, path: ['data'] }])
  })
})

describe('array', () => {
  test('does not match non-array', () => {
    const expected: any[] = []
    const s = createSatisfier(expected)

    expect(s.exec(undefined)).toEqual([{ path: [], expected, actual: undefined }])
    expect(s.exec(null)).toEqual([{ path: [], expected, actual: null }])
    expect(s.exec(true)).toEqual([{ path: [], expected, actual: true }])
    expect(s.exec(1)).toEqual([{ path: [], expected, actual: 1 }])
    expect(s.exec(1n)).toEqual([{ path: [], expected, actual: 1n }])
    expect(s.exec('boo')).toEqual([{ path: [], expected, actual: 'boo' }])
    expect(s.exec(testSymbol)).toEqual([{ path: [], expected, actual: testSymbol }])
    expect(s.exec(/boo/)).toEqual([{ path: [], expected, actual: /boo/ }])
    expect(s.exec({})).toEqual([{ path: [], expected, actual: {} }])
    expect(s.exec(testFn)).toEqual([{ path: [], expected, actual: testFn }])
    expect(s.exec(testArrow)).toEqual([{ path: [], expected, actual: testArrow }])
  })

  test('empty array matches only empty array', () => {
    const expected: any[] = []
    const s = createSatisfier(expected)
    expect(s.exec([])).toBeUndefined()
    expect(s.exec([1])).toEqual([{ path: [0], expected: undefined, actual: 1 }])
  })

  test('not match different length', () => {
    expect(createSatisfier([1]).exec([1, 2])).toEqual([{ path: [1], expected: undefined, actual: 2 }])
  })

  test('match each entry', () => {
    expect(createSatisfier([{ a: 1 }, { b: 2 }]).exec([{ a: 2 }, {}])).toEqual([
      { path: [0, 'a'], expected: 1, actual: 2 },
      { path: [1, 'b'], expected: 2, actual: undefined }
    ])
  })
})

describe('predicate function', () => {
  test('consider match when predicate returns true', () => {
    const s = createSatisfier(v => v === 1)

    expect(s.exec(1)).toBeUndefined()
  })

  test('consider not match when predicate returns false', () => {
    const s = createSatisfier(v => v === 1)

    expect(s.exec(2)).toEqual([{ path: [], expected: s.expected, actual: 2 }])
  })

  test('returns diff result from predicate', () => {
    expect(createSatisfier(() => ([{ path: [], expected: 1, actual: 2 }])).exec(9))
      .toEqual([{ path: [], expected: 1, actual: 2 }])
  })

  test('receives path in the second parameter', () => {
    expect(createSatisfier({ a: (v, path) => ([{ path, expected: 1, actual: 2 }]) }).exec({ a: 3 }))
      .toEqual([{ path: ['a'], expected: 1, actual: 2 }])
  })

  test('apply property predicate', () => {
    const s = createSatisfier({ data: v => v === 1 });

    expect(s.exec({ data: 1 })).toBeUndefined()
    expect(s.exec({ data: 2 })).toEqual([{ path: ['data'], expected: s.expected.data, actual: 2 }])
    expect(s.exec({ foo: 'b' })).toEqual([{ path: ['data'], expected: s.expected.data, actual: undefined }])
  })
})

test('use generic to lock in the type of the input', () => {
  const s = createSatisfier<{ a: number }>(undefined)
  const y: Parameters<typeof s.exec> = {} as any
  assertType<{ a: number }>(y[0])
})

describe('test()', () => {
  test('return true if exec() returns undefined', () => {
    const s = createSatisfier(anything)
    s.exec = () => undefined

    expect(s.test(undefined)).toBe(true)
  })

  test('returns false if exec() returns diffs', () => {
    const s = createSatisfier(anything)
    s.exec = () => []

    expect(s.test(undefined)).toBe(false)
  })
})
