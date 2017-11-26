export function isTypeOf(x: 'number' | 'boolean' | 'string') {
  // tslint:disable-next-line
  return (a) => typeof a === x
}
