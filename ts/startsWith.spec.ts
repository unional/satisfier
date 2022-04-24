import { createSatisfier, startsWith } from '.'

test('non array returns false', () => {
  expect(createSatisfier(startsWith([{ a: 1 }])).test(undefined)).toBe(false)
  expect(createSatisfier(startsWith([{ a: 1 }])).test(null)).toBe(false)
  expect(createSatisfier(startsWith([{ a: 1 }])).test(1)).toBe(false)
  expect(createSatisfier(startsWith([{ a: 1 }])).test(true)).toBe(false)
  expect(createSatisfier(startsWith([{ a: 1 }])).test('a')).toBe(false)
  expect(createSatisfier(startsWith([{ a: 1 }])).test({ a: 1 })).toBe(false)
})

test('empty array will pass any array', () => {
  expect(createSatisfier(startsWith([])).test([])).toBe(true)
  expect(createSatisfier(startsWith([])).test([1])).toBe(true)
})

test('test against shorter array returns false', () => {
  expect(createSatisfier(startsWith([{ a: 1 }])).test([])).toBe(false)
  expect(createSatisfier(startsWith([{ a: 1 }, { b: 1 }])).test([{ a: 1 }])).toBe(false)
})

test('test against longer array returns true', () => {
  expect(createSatisfier(startsWith([{ a: 1 }])).test([{ a: 1 }, { b: 1 }])).toBe(true)
})

test('each entry are checked', () => {
  expect(createSatisfier(startsWith([{ a: 1 }])).test([{ a: 1, b: 1 }])).toBe(true)
})

test('array property inside entry is tested with exact logic', () => {
  const satisfier = createSatisfier(startsWith([{ a: [1, 2] }]))
  expect(satisfier.test([{ a: [1, 2] }, 2])).toBe(true)
  expect(satisfier.test([{ a: [1, 2, 3] }, 2])).toBe(false)
})

test('tersify()', () => {
  expect(startsWith([{ a: 1 }, { b: 2 }]).tersify()).toBe('startsWith([{ a: 1 }, { b: 2 }])')
})
