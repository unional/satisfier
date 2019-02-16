import { SatisfierExec } from './interfaces'

export abstract class ArrayEntryExpectation {
  abstract exec(actual: any, path: string[]): SatisfierExec[] | undefined
}
