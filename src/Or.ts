import { createSatisfier } from './createSatisfier'
import { ArrayEntryExpectation } from './ArrayEntryExpectation';
import { Satisfier, SatisfierExec } from './interfaces';

/**
 * Check if an array has entries satisfy the expectations in order.
 */
export class Or extends ArrayEntryExpectation {
  satisfiers: Satisfier<any>[]
  constructor(...expectations: any[]) {
    super()
    this.satisfiers = expectations.map(createSatisfier)
  }
  exec(actual: any, path: string[]) {
    let diff: SatisfierExec[] = []
    for (let i = 0; i < this.satisfiers.length; i++) {
      const s = this.satisfiers[i]
      const eachDiff = s.exec(actual)
      if (!eachDiff) return undefined
      eachDiff.forEach(d => d.path = [...path, ...d.path])
      diff.push(...eachDiff)
    }
    return diff
  }
}
