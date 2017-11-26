import { test } from 'ava'

import { Satisfier } from './index'

test('generate() is hooked up', t => {
  t.deepEqual(new Satisfier(1).generate(), 1)
})
