import t from 'assert'
import a from 'assertron'

import { createSatisfier } from '.'
import { AtLeastOnce } from './AtLeastOnce'

test.skip('fail when subject is not an array', () => {
  a.false(createSatisfier([new AtLeastOnce(1)]).test(1))
  a.false(createSatisfier([new AtLeastOnce(1)]).test(true))
  a.false(createSatisfier([new AtLeastOnce(1)]).test('a'))
  a.false(createSatisfier([new AtLeastOnce(1)]).test({ a: 1 }))
})

test.skip('fail when subject does not contain at least one element satisfying the expectation', () => {
  a.false(createSatisfier([new AtLeastOnce(1)]).test([]))
  a.false(createSatisfier([new AtLeastOnce(1)]).test([0, 2, 'a', true, { a: 1 }]))
})

test.skip('pass when subject contains at least one element satisfying the expectation', () => {
  t(createSatisfier([new AtLeastOnce(1)]).test([1]))
})

test.skip('match one follow with one miss', () => {
  t(createSatisfier([new AtLeastOnce(1), 3]).test([1, 2, 3, 4]))
})

test.skip('match one follow with two misses', () => {
  t(createSatisfier([new AtLeastOnce(1), 4]).test([1, 2, 3, 4]))
})
