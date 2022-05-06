import { tersible, tersify } from 'tersify'
import { createSatisfier } from './createSatisfier'

/**
 * Check if an array have no entry satisfying the expectation.
 * @param expectation expectation
 */
export function none(expectation: any) {
  const s = createSatisfier(expectation)
  return tersible((e: any) => e && Array.isArray(e) && !e.some(v => s.test(v)), () => `none(${tersify(expectation)})`)
}
