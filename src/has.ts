import {
  tersible,
  tersify,
  // @ts-ignore
  Tersify
} from 'tersify'

import { createSatisfier } from './createSatisfier'

/**
 * Check if an array has entries satisfy the expectations in order.
 */
export function has(...expectations: any[]) {
  return tersible(arr => {
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
  }, () => `has(${expectations.map(e => tersify(e)).join(', ')})`)
}
