import {
  tersible,
  tersify,
  // @ts-ignore
  Tersible
} from 'tersify'

import { createSatisfier } from './createSatisfier'

export function has(expectation) {
  const s = createSatisfier(expectation)
  return tersible(e => e && Array.isArray(e) && e.some(v => s.test(v)), () => `has(${tersify(expectation)})`)
}
