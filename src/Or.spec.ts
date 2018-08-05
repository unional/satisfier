import t from 'assert'

import { createSatisfier } from '.'
import { Or } from './Or'
import { assertExec } from './testUtil'

test('fail when not passing all expectations', () => {
  const s = createSatisfier([new Or({ a: 1 }, { b: 2 })])
  const actual = s.exec([{ c: 1 }])!
  assertExec(actual[0], ['[0]', 'a'], 1, undefined)
  assertExec(actual[1], ['[0]', 'b'], 2, undefined)
})

test('pass when passing any expectations', () => {
  const s = createSatisfier([new Or({ a: 1 }, { b: 2 })])
  t.strictEqual(s.exec([{ a: 1 }]), undefined)
  t.strictEqual(s.exec([{ b: 2 }]), undefined)
})
