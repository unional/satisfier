import { Diff, Satisfier } from './interfaces'
import { ArrayEntryExpectation } from './ArrayEntryExpectation'
import { Or } from './Or'

/**
 * creates a satisfier
 * @param expectation All properties can be a value which will be compared to the same property in `actual`, RegExp, or a predicate function that will be used to check against the property.
 */
export function createSatisfier<T = any>(expectation: any): Satisfier<T> {
  function test(actual: T) {
    return exec(actual) === undefined
  }
  /**
   * Check if `actual` satisfies the expected criteria.
   */
  function exec(actual: T) {
    if (Array.isArray(actual)) {
      const diff: Diff[] = []
      if (Array.isArray(expectation)) {
        const arrayEntryExps: ArrayEntryExpectation[] = []
        const exp = expectation.map(e => {
          if (arrayEntryExps.length >= 1) {
            return new Or(...arrayEntryExps, e)
          }

          if (e instanceof ArrayEntryExpectation) {
            arrayEntryExps.push(e)
          }
          return e
        })
        let a = 0
        exp.forEach((e: any) => {
          if (e === undefined) {
            a = a + 1
            return
          }
          diff.push(...detectDiff(actual[a], e, [`[${a}]`], a))
          a = a + 1
        })
        if (actual.length > exp.length) {
          for (let i = exp.length; i < actual.length; i++) {
            diff.push({ path: [`[${i}]`], expected: undefined, actual: actual[i] })
          }
        }
      }
      else if (typeof expectation === 'function') {
        diff.push(...detectDiff(actual, expectation))
      }
      else if (actual.length === 0) {
        diff.push({ path: [], expected: expectation, actual })
      }
      else {
        actual.forEach((a, i) => {
          diff.push(...detectDiff(a, expectation, [`[${i}]`], i))
        })
      }
      return diff.length === 0 ? undefined : diff
    }
    const diff = detectDiff(actual, expectation)
    return diff.length === 0 ? undefined : diff
  }
  return {
    test,
    exec
  }
}

function detectDiff(actual: any, expected: any, path: string[] = [], index?: number) {
  const diff: Diff[] = []
  const expectedType = typeof expected
  if (expectedType === 'function') {
    if (!(expected as Function)(actual, index)) {
      diff.push({
        path,
        expected,
        actual
      })
    }
  }
  else if (expected === undefined) {
    return diff
  }
  else if (expected === null) {
    if (expected !== actual)
      diff.push({
        path,
        expected,
        actual
      })
  }
  else if (expectedType === 'number' && typeof actual === 'number') {
    if (isNaN(expected) && isNaN(actual)) return diff
    if (expected !== actual)
      diff.push({ path, expected, actual })
  }
  else if (expectedType === 'boolean' || expectedType === 'number' || expectedType === 'string' || actual === undefined) {
    if (expected !== actual)
      diff.push({ path, expected, actual })
  }
  else if (expected instanceof ArrayEntryExpectation) {
    const d = expected.exec(actual, path)
    if (d) diff.push(...d)
  }
  else if (expected instanceof RegExp) {
    if (!expected.test(actual)) {
      diff.push({
        path,
        expected,
        actual
      })
    }
  }
  else if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) {
      diff.push({
        path,
        expected,
        actual
      })
    }
    else {
      expected.forEach((e: any, i) => {
        if (e === undefined)
          return
        const actualValue = actual[i]
        diff.push(...detectDiff(actualValue, e, path.concat([`[${i}]`]), i))
      })
    }
  }
  else {
    // expected is object. If actual is not, then it is diff.
    const actualType = typeof actual
    if (actualType === 'boolean' || actualType === 'string' || actualType === 'number' || actual === undefined || actual === null)
      diff.push({
        path,
        expected,
        actual
      })
    else {
      Object.keys(expected).forEach(k => {
        diff.push(...detectDiff(actual[k], expected[k], path.concat([k])))
      })
    }
  }
  return diff
}
