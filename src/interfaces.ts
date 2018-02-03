import { Tersible } from 'tersify'

export type Predicate = (value: any) => boolean

export type TersiblePredicate = Tersible<Predicate>

export interface SatisfierExec {
  path: string[],
  expected: any,
  actual: any
}
