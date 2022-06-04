import { tersible, tersify } from 'tersify'
import { createSatisfier } from './createSatisfier.js'

/**
 * Check if an array has the first n entries satisfying the specified expectations.
 */
export function startsWith(expectations: any[]) {
  return tersible((value: any) => {
    if (!Array.isArray(value)) return false
    if (expectations.length === 0) return true
    return expectations.every((e, i) => {
      const a = value[i]
      return createSatisfier(e).test(a)
    })
  }, () => `startsWith([${expectations.map(e => tersify(e)).join(', ')}])`)
}
