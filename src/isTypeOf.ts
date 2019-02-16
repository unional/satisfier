import {
  tersible,
  // @ts-ignore
  Tersify,
  // @ts-ignore
  TersifyOptions
} from 'tersify'

export function isTypeOf(x: 'number' | 'boolean' | 'string') {
  return tersible(
    // tslint:disable-next-line:strict-type-predicates
    (a: any) => typeof a === x,
    () => `typeof ${x}`)
}
