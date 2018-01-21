import {
  tersible,
  tersify,
  // @ts-ignore
  Tersible
} from 'tersify'

import { createSatisfier } from './createSatisfier'

/**
 * Check if an array have at least one entry satisfying the expectation.
 * @param expectation expectation
 */
export function some(expectation) {
  const s = createSatisfier(expectation)
  return tersible(e => e && Array.isArray(e) && e.some(v => s.test(v)), () => `some(${tersify(expectation)})`)
}
