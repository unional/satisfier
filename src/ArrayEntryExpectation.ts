import { SatisfierExec } from './interfaces'

export abstract class ArrayEntryExpectation {
  abstract exec(actual, path): SatisfierExec[] | undefined
}
