import t from 'assert'

import { Or, createSatisfier } from '.'
import { assertExec } from './testUtil'

test('fail when not passing all expectations', () => {
  const s = createSatisfier([new Or({ a: 1 }, { b: 2 })])
  const actual = s.exec([{ c: 1 }])!
  assertExec(actual[0], ['[0]', 'a'], 1, undefined)
  assertExec(actual[1], ['[0]', 'b'], 2, undefined)
})

test('pass when passing any expectations', () => {
  const s = createSatisfier([new Or({ a: 1 }, { b: 2 })])
  t.equal(s.exec([{ a: 1 }]), undefined)
  t.equal(s.exec([{ b: 2 }]), undefined)
})
