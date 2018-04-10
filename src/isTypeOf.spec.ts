import t from 'assert'
import a from 'assertron'

import { createSatisfier, isTypeOf } from '.'

test('check type of property', () => {
  t(createSatisfier({ a: isTypeOf('number') }).test({ a: 1 }))
  a.false(createSatisfier({ a: isTypeOf('number') }).test({ a: false }))
  a.false(createSatisfier({ a: isTypeOf('number') }).test({ a: 'a' }))

  a.false(createSatisfier({ a: isTypeOf('boolean') }).test({ a: 1 }))
  t(createSatisfier({ a: isTypeOf('boolean') }).test({ a: false }))
  a.false(createSatisfier({ a: isTypeOf('boolean') }).test({ a: 'a' }))

  a.false(createSatisfier({ a: isTypeOf('string') }).test({ a: 1 }))
  a.false(createSatisfier({ a: isTypeOf('string') }).test({ a: false }))
  t(createSatisfier({ a: isTypeOf('string') }).test({ a: 'a' }))
})

test('tersify()', () => {
  t.equal(isTypeOf('number').tersify(), 'typeof number')
})
