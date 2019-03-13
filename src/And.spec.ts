import t from 'assert';
import { createSatisfier } from '.';
import { and } from './and';
import { assertDiff } from './testUtil';


test.skip('fail when not passing any expectations', () => {
  const s = createSatisfier([and({ a: 1 }, { b: 2 })])
  const actual = s.exec([{ a: 1 }])!
  assertDiff(actual[0], ['[0]', 'b'], 2, undefined)
})

test.skip('pass when passing all expectations', () => {
  const s = createSatisfier([and({ a: 1 }, { b: 2 })])
  t.strictEqual(s.exec([{ a: 1, b: 2 }]), undefined)
})
