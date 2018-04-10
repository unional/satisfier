import { Tersible } from 'tersify'

export type Predicate = (value: any) => boolean

export type TersiblePredicate = Tersible<Predicate>

export interface Satisfier<T = any> {
  test: (actual: T) => boolean;
  exec: (actual: T) => SatisfierExec[] | undefined;
}

export interface SatisfierExec {
  path: string[],
  expected: any,
  actual: any
}
