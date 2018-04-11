import { createSatisfier } from './createSatisfier'
import { ArrayEntryExpectation } from './ArrayEntryExpectation';
import { Satisfier, SatisfierExec } from './interfaces';

/**
 * Check if an array has entries satisfy the expectations in order.
 */
export class And extends ArrayEntryExpectation {
  satisfiers: Satisfier<any>[]
  constructor(...expectations: any[]) {
    super()
    this.satisfiers = expectations.map(createSatisfier)
  }
  exec(actual, path) {
    let diff: SatisfierExec[] | undefined
    this.satisfiers.some(s => {
      diff = s.exec(actual)
      if (diff) {
        diff.forEach(d => d.path = [...path, ...d.path])
      }

      return !!diff
    })
    return diff
  }
}
