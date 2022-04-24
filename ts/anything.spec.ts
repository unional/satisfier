import { anything } from './anything'
import { createSatisfier } from './createSatisfier'
import { testArrow, testFn, testSymbol } from './testPredicates'


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
  expect(s.exec(testSymbol)).toBeUndefined()
  expect(s.exec(testFn)).toBeUndefined()
  expect(s.exec(testArrow)).toBeUndefined()
})
