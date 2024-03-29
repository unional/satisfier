import { anything } from './anything.js'
import { Diff, Predicate, Satisfier } from './interfaces.js'

export type Expectation = symbol | undefined | null | boolean | number | bigint |
  string | RegExp | Array<Expectation> | { [key: string]: Expectation } | Predicate

export function createSatisfier<T = any>(expected: Expectation): Satisfier<T> {
  return {
    expected,
    test(actual: T) {
      return this.exec(actual) === undefined
    },
    exec(actual: T) {
      const d = diff(expected, actual)
      return d.length ? d : undefined
    }
  }
}

const noDiff: Diff[] = []
function diff(expected: any, actual: any, path: Diff['path'] = []): Diff[] {
  if (expected === anything) {
    return noDiff
  }

  if (expected === undefined || expected === null) {
    return actual === expected ? noDiff : [{ path, expected, actual }]
  }

  if (typeof expected === 'bigint') {
    return actual === expected ? noDiff : [{ path, expected, actual }]
  }

  const expectedType = typeof expected

  if (expectedType === 'number') {
    if (isNaN(expected)) {
      return typeof actual === 'number' && isNaN(actual) ? noDiff : [{ path, expected, actual }]
    }
    else {
      return actual === expected ? noDiff : [{ path, expected, actual }]
    }
  }

  if (expectedType === 'boolean' || expectedType === 'string' || expectedType === 'symbol') {
    return actual === expected ? noDiff : [{ path, expected, actual }]
  }

  if (expected instanceof RegExp) {
    if (actual instanceof RegExp) {
      return expected.test(String(actual)) ? noDiff : [{ path, expected, actual }]
    }
    else {
      return (typeof actual === 'string') && expected.test(actual) ?
        noDiff :
        [{ path, expected, actual }]
    }
  }

  if (expected instanceof Date) {
    if (!(actual instanceof Date)) {
      return [{ path, expected, actual }]
    }
    else {
      return expected.toISOString() === actual.toISOString()
        ? noDiff : [{ path, expected, actual }]
    }
  }

  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) {
      return [{ path, expected, actual }]
    }
    else {
      const max = Math.max(expected.length, actual.length)
      const diffs: Diff[] = []
      for (let i = 0; i < max; i++) {
        const e = expected[i]
        const a = actual[i]
        diffs.push(...diff(e, a, path.concat([i])))
      }

      return diffs
    }
  }

  if (expectedType === 'function') {
    const r = (expected as Predicate)(actual, path)
    if (r === true) return noDiff
    return r ? r : [{ path, expected, actual }]
  }

  // expected is an object
  return diffObject(expected, actual, path)
}

function diffObject(expected: any, actual: any, path: Diff['path']): Diff[] {
  if (actual === undefined || actual === null) {
    return [{ path, expected, actual }]
  }
  const actualType = typeof actual
  if (actualType === 'boolean' ||
    actualType === 'string' ||
    actualType === 'number' ||
    actualType === 'bigint' ||
    actualType === 'symbol' ||
    actual instanceof RegExp) {
    return [{ path, expected, actual }]
  }
  else if (Array.isArray(actual)) {
    return [{ path, expected, actual }]
    // return actual.reduce((p, v, i) => {
    //   p.push(...diff(expected, v, path.concat([i])))
    //   return p
    // }, [] as Diff[])
  }
  else {
    // if (Object.keys(expected).length > 0) {
    //   const ro = diffObject(expected, actual, path)
    //   if (ro.length === 0) return ro
    // }
    return Object.keys(expected).reduce((p, key: string) => {
      p.push(...diff(expected[key], actual[key], path.concat([key])))
      return p
    }, [] as Diff[])
  }
}
