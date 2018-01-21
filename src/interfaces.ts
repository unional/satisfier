import { Tersible } from 'tersify'

export type Predicate = (value: any) => boolean

export type TersiblePredicate = Tersible<Predicate>

export type Expectation<T extends Struct = Struct> = Function | Partial<ExpectationHash<T>> | Partial<ExpectationHash<T>>[]
export type ExpectationNode<T extends Struct = Struct> = undefined | null | boolean | number | string | RegExp | Predicate | Partial<ExpectationHash<T>>
export type ExpectationHash<T extends Struct = Struct> = {
  [P in keyof T]: ExpectationNode<T[P]> | ExpectationNode<T[P]>[];
}

export type Struct = null | StructNode | StructHash | (StructNode | StructHash)[]

export type StructNode = boolean | number | string | object

export type StructHash = { [i: string]: Struct }

export interface SatisfierExec {
  path: string[],
  expected: boolean | number | string | RegExp | Predicate | ExpectationHash,
  actual: any
}
