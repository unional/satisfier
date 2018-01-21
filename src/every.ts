import {
  tersible,
  tersify,
  // @ts-ignore
  Tersible
} from 'tersify'

import { createSatisfier } from './createSatisfier'

/**
 * Check if every entry in the array satisfies the expectation.
 * @param expectation expectation
 */
export function every(expectation) {
  const s = createSatisfier(expectation)
  return tersible(e => e && Array.isArray(e) && e.every(v => s.test(v)), () => `every(${tersify(expectation)})`)
}
