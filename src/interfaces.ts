import { Tersible } from 'tersify'

export type Predicate = (value: any, path: (string | number)[]) => boolean | Diff[]

export type TersiblePredicate = Tersible<Predicate>

export interface Satisfier<T = any> {
  expected: any,
  test: (actual: T) => boolean,
  exec: (actual: T) => Diff[] | undefined,
}

export interface Diff {
  path: (string | number)[],
  expected: any,
  actual: any,
}
