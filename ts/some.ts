import { Tersible, tersible, tersify } from 'tersify'
import { createSatisfier, Expectation } from './createSatisfier'
import { Predicate } from './interfaces'

/**
 * Check if an array have at least one entry satisfying the expectation.
 * @param expectation expectation
 */
export function some<E extends Expectation>(expectation: E): Tersible<Predicate> {
  const s = createSatisfier(expectation)
  return tersible((e: any) => e && Array.isArray(e) && e.some(v => s.test(v)), () => `some(${tersify(expectation)})`)
}
