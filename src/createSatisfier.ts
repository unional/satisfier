import { Struct, Expectation, SatisfierExec } from './interfaces'

/**
 * creates a satisfier
 * @param expectation All properties can be a value which will be compared to the same property in `actual`, RegExp, or a predicate function that will be used to check against the property.
 */
export function createSatisfier<T extends Struct = Struct>(expectation: Expectation<T>): {
  test: (actual: T) => boolean;
  exec: (actual: T) => SatisfierExec[] | undefined;
} {
  function test(actual: T) {
    return exec(actual) === undefined
  }
  /**
   * Check if `actual` satisfies the expected criteria.
   */
  function exec(actual: T) {
    if (Array.isArray(actual)) {
      const diff: SatisfierExec[] = []
      if (Array.isArray(expectation)) {
        expectation.forEach((e: any, i) => {
          if (e === undefined)
            return
          diff.push(...detectDiff(actual[i], e, [`[${i}]`], i))
        })
      }
      else if (typeof expectation === 'function') {
        diff.push(...detectDiff(actual, expectation))
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

function detectDiff(actual, expected, path: string[] = [], index?: number) {
  const diff: SatisfierExec[] = []
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
  else if (expected === null || expected === undefined) {
    if (expected !== actual)
      diff.push({
        path,
        expected,
        actual
      })
  }
  else if (expectedType === 'boolean' || expectedType === 'number' || expectedType === 'string' || actual === undefined) {
    if (expected !== actual)
      diff.push({
        path,
        expected,
        actual
      })
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
