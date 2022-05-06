import { tersible } from 'tersify'

export function isTypeOf(x: 'number' | 'boolean' | 'string') {
  return tersible(
    (a: any) => typeof a === x,
    () => `typeof ${x}`)
}
