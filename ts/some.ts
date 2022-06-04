import { tersible, tersify } from 'tersify'
import { createSatisfier, Expectation } from './createSatisfier.js'

/**
 * Check if an array have at least one entry satisfying the expectation.
 * @param expectation expectation
 */
export function some<E extends Expectation>(expectation: E) {
  const s = createSatisfier(expectation)
  return tersible((e: any) => e && Array.isArray(e) && e.some(v => s.test(v)), () => `some(${tersify(expectation)})`)
}
