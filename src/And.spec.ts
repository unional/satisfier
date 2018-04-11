import t from 'assert'

import { And, createSatisfier } from '.'
import { assertExec } from './testUtil'

test('fail when not passing any expectations', () => {
  const s = createSatisfier([new And({ a: 1 }, { b: 2 })])
  const actual = s.exec([{ a: 1 }])!
  assertExec(actual[0], ['[0]', 'b'], 2, undefined)
})

test('pass when passing all expectations', () => {
  const s = createSatisfier([new And({ a: 1 }, { b: 2 })])
  t.equal(s.exec([{ a: 1, b: 2 }]), undefined)
})
