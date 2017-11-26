import { test } from 'ava';
import { createSatisfier, isInRange } from './index';

test('check number in range', t => {
  t.false(createSatisfier(isInRange(1, 3)).test(0))
  t.true(createSatisfier(isInRange(1, 3)).test(1))
  t.true(createSatisfier(isInRange(1, 3)).test(2))
  t.true(createSatisfier(isInRange(1, 3)).test(3))
  t.false(createSatisfier(isInRange(1, 3)).test(4))
})
