import { Tersible, tersible } from 'tersify'
import { Predicate } from './interfaces'

export function isTypeOf(x: 'number' | 'boolean' | 'string'): Tersible<Predicate>{
  return tersible(
    // tslint:disable-next-line:strict-type-predicates
    (a: any) => typeof a === x,
    () => `typeof ${x}`)
}
