import { ArrayEntryExpectation } from './ArrayEntryExpectation'
import { createSatisfier } from './createSatisfier'
import { SatisfierExec, Satisfier } from './interfaces'

export class AtLeastOnce extends ArrayEntryExpectation {
  pass = false
  satisfier: Satisfier<any>
  constructor(public expectation: any) {
    super()
    this.satisfier = createSatisfier(expectation)
  }

  exec(actual): SatisfierExec[] {
    if (this.pass) return []

    const result = this.satisfier.exec(actual)
    if (!result) {
      this.pass = true
      return []
    }

    return result
  }
}
