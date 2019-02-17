import { Tersible } from 'tersify'

export type Predicate = (value: any) => boolean

export type TersiblePredicate = Tersible<Predicate>

export interface Satisfier<T = any> {
  test: (actual: T) => boolean;
  exec: (actual: T) => Diff[] | undefined;
}

export interface Diff {
  path: string[],
  expected: any,
  actual: any
}
