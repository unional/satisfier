import { tersible, tersify } from 'tersify'
import { some } from './some.js'

/**
 * Check if an array has all of the expected entries, regardless of order.
 */
export function hasAll(...expectations: any[]) {
  return tersible((arr: any) => {
    if (!Array.isArray(arr)) return false
    return expectations.every(e => some(e)(arr))
  }, () => `hasAll(${expectations.map(e => tersify(e)).join(', ')})`)
}
