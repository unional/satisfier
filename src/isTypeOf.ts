export function isTypeOf(x: 'number' | 'boolean' | 'string') {
  return (a) => typeof a === x
}
