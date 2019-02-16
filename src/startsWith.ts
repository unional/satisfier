import {
  tersible,
  tersify,
  // @ts-ignore
  Tersify
} from 'tersify'

import { createSatisfier } from './createSatisfier'

/**
 * Check if an array has the first n entries satisfying the specifiec expectations.
 */
export function startsWith(...expectations: any[]) {
  return tersible((arr: any) => {
    if (!Array.isArray(arr)) return false
    let index = 0
    return expectations.some(e => {
      const s = createSatisfier(e)
      let actual = arr[index]
      while (index < arr.length && !s.test(actual)) {
        actual = arr[++index]
      }
      return index !== arr.length
    })
  }, () => `startsWith(${expectations.map(e => tersify(e)).join(', ')})`)
}
