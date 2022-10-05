import { satisfies } from './index.js'

test('expected can be value', () => {
  expect(satisfies(false, false)).toBe(true)
  expect(satisfies(1, 1)).toBe(true)
  expect(satisfies('a', 'a')).toBe(true)
})

it('can compare date', () => {
  expect(satisfies(new Date(1,2,3), new Date(1,2,3))).toBe(true)
  expect(satisfies(new Date(1,2,3), new Date(1,2,4))).toBe(false)
})

test('expected can be predicate', () => {
  expect(satisfies(1, v => v === 1)).toBe(true)
})

describe('when actual is object', () => {
  test('expected can be object', () => {
    expect(satisfies({ a: 1 }, { a: 1 })).toBe(true)
    expect(satisfies({ a: 1 }, {})).toBe(true)
  })

  test('expected can be predicate', () => {
    expect(satisfies({ a: 1 }, v => !!v)).toBe(true)
  })

  test('expected property can be predicate', () => {
    expect(satisfies({ a: 1 }, { a: v => v === 1 })).toBe(true)
  })

  test('deep expected property can be object', () => {
    expect(satisfies({ a: { b: 'foo' } }, { a: { b: 'boo' } })).toBe(false)
    expect(satisfies({ a: { b: 'foo' } }, { a: {} })).toBe(true)
  })

  test('deep expected property can be predicate', () => {
    expect(satisfies({ a: { b: 'foo' } }, { a: { b: v => v === 'foo' } })).toBe(true)
  })
})

describe('when actual is array', () => {
  test('expected can be array', () => {
    expect(satisfies([{ a: 1 }], [])).toBe(false)
    expect(satisfies([{ a: 1 }], [{ a: 1 }])).toBe(true)
  })

  test('expected can be predicate', () => {
    expect(satisfies([{ a: 1 }], v => !!v)).toBe(true)
  })

  test('expected entry can be predicate', () => {
    expect(satisfies([{ a: 1 }], [v => v.a === 1])).toBe(true)
  })
})
