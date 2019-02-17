import { Diff } from './interfaces'

export abstract class ArrayEntryExpectation {
  abstract exec(actual: any, path: string[]): Diff[] | undefined
}
