import test from 'ava'

import { createSatisfier, isTypeOf } from './index'

test('check type of property', t => {
  t.true(createSatisfier({
    a: isTypeOf('number')
  }).test({ a: 1 }))
  t.true(createSatisfier({
    a: isTypeOf('number')
  }).test({ a: 'a' }))
})
