import t from 'assert'
import a from 'assertron'

import {
  createSatisfier,
  isInClosedInterval,
  isInLeftClosedInterval,
  isInOpenInterval,
  isInRightClosedInterval
} from './index'


test('open interval', () => {
  a.false(createSatisfier(isInOpenInterval(1, 3)).test(1))
  t(createSatisfier(isInOpenInterval(1, 3)).test(2))
  a.false(createSatisfier(isInOpenInterval(1, 3)).test(3))
})

test('closed interval', () => {
  a.false(createSatisfier(isInClosedInterval(1, 3)).test(0))
  t(createSatisfier(isInClosedInterval(1, 3)).test(1))
  t(createSatisfier(isInClosedInterval(1, 3)).test(2))
  t(createSatisfier(isInClosedInterval(1, 3)).test(3))
  a.false(createSatisfier(isInClosedInterval(1, 3)).test(4))
})

test('left closed', () => {
  a.false(createSatisfier(isInLeftClosedInterval(1, 3)).test(0))
  t(createSatisfier(isInLeftClosedInterval(1, 3)).test(1))
  t(createSatisfier(isInLeftClosedInterval(1, 3)).test(2))
  a.false(createSatisfier(isInLeftClosedInterval(1, 3)).test(3))
})

test('right closed', () => {
  a.false(createSatisfier(isInRightClosedInterval(1, 3)).test(1))
  t(createSatisfier(isInRightClosedInterval(1, 3)).test(2))
  t(createSatisfier(isInRightClosedInterval(1, 3)).test(3))
  a.false(createSatisfier(isInRightClosedInterval(1, 3)).test(4))
})

test('tersify()', () => {
  t.equal(isInOpenInterval(1, 3).tersify(), '(1...3)')
  t.equal(isInClosedInterval(1, 3).tersify(), '[1...3]')
  t.equal(isInLeftClosedInterval(1, 3).tersify(), '[1...3)')
  t.equal(isInRightClosedInterval(1, 3).tersify(), '(1...3]')
})
