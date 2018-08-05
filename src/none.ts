import {
  tersible,
  tersify,
  // @ts-ignore
  Tersible
} from 'tersify'

import { createSatisfier } from './createSatisfier'

/**
 * Check if an array have at least one entry satisfying the expectation.
 * @deprecated please use `has()` instead
 * @param expectation expectation
 */
export function none(expectation) {
  const s = createSatisfier(expectation)
  return tersible(e => e && Array.isArray(e) && !e.some(v => s.test(v)), () => `none(${tersify(expectation)})`)
}
