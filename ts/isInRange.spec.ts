import t from 'assert'
import a from 'assertron'

import { createSatisfier, isInRange } from './index.js'

test('check number in range', () => {
  a.false(createSatisfier(isInRange(1, 3)).test(0))
  t(createSatisfier(isInRange(1, 3)).test(1))
  t(createSatisfier(isInRange(1, 3)).test(2))
  t(createSatisfier(isInRange(1, 3)).test(3))
  a.false(createSatisfier(isInRange(1, 3)).test(4))
})

test('tersify()', () => {
  t.strictEqual(isInRange(1, 3).tersify(), '[1...3]')
})
