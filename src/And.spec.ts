import t from 'assert'
import a from 'assertron'

import { And } from './And'
import { createSatisfier } from 'satisfier';

test.skip('fail when subject is not an array', () => {
  const subject = new And({ a: 1 }, { b: 2 })
  const s = createSatisfier([subject])
  a.false(s.test([{ a: 1 }]))
  t(s.test([{ a: 1, b: 2 }]))
})
