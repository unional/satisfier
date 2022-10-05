import { createSatisfier, every, formatDiffs, has } from './index.js'

test('index is wrapped with []', () => {
  const diffs = createSatisfier(every({ a: { b: { c: /foo/ } } })).exec([{ a: {} }, { a: { b: {} } }, { a: { b: { c: 'boo' } } }])
  const actual = formatDiffs(diffs)
  expect(actual).toEqual(
    `expect '[0].a.b' to satisfy { c: /foo/ }, but received undefined
expect '[1].a.b.c' to satisfy /foo/, but received undefined
expect '[2].a.b.c' to satisfy /foo/, but received 'boo'`
  )
})

test('uses tersify function when available', () => {
  const diffs = createSatisfier(has(1)).exec([2, 3])
  const actual = formatDiffs(diffs)
  expect(actual).toEqual(`expect subject to satisfy has(1), but received [2, 3]`)
})

it('returns empty string if no diff', () => {
  expect(formatDiffs(undefined)).toEqual('')
})
