export * from './createSatisfier'
export * from './every'
export * from './some'
export * from './interfaces'
export * from './isInRange'
export * from './isInInterval'
export * from './isTypeOf'

// @ts-ignore
import { Tersify } from 'tersify'
import { some } from './some'

// istanbul ignore next
export function has(expectation) {
  console.warn('has is deprecated, please use some().')
  return some(expectation)
}
