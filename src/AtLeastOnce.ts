import { ArrayEntryExpectation } from './ArrayEntryExpectation'
import { createSatisfier } from './createSatisfier'
import { SatisfierExec, Satisfier } from './interfaces'

export class AtLeastOnce extends ArrayEntryExpectation {
  private pass = false
  private satisfier: Satisfier<any>
  constructor(expectation: any) {
    super()
    this.satisfier = createSatisfier(expectation)
  }

  exec(actual: any): SatisfierExec[] {
    if (this.pass) return []

    const result = this.satisfier.exec(actual)
    if (!result) {
      this.pass = true
      return []
    }

    return result
  }
}
