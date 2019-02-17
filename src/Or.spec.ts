import { createSatisfier } from '.';
import { or } from './or';

test('pass if meeting one of the expectation', () => {
  const s = createSatisfier(or({ a: 1 }, { b: 2 }))

  expect(s.exec({ a: 1 })).toBeUndefined()
  expect(s.exec({ b: 2 })).toBeUndefined()
})

test.skip('fail is none of the expectation are met', () => {
  const s = createSatisfier(or({ a: 1 }, { b: 2 }))

  expect(s.exec({ c: 1 })).toEqual([{ path: [], expected: s.expected, actual: undefined }])
})

test.todo('test individual entry of an array if the expectations are not')
test.todo('[[],[]]?')
test.todo('primitive types')

// test('fail when not passing all expectations', () => {
//   const s = createSatisfier([or({ a: 1 }, { b: 2 })])
//   const actual = s.exec([{ c: 1 }])!
//   assertDiff(actual[0], [0, 'a'], 1, undefined)
//   assertDiff(actual[1], [0, 'b'], 2, undefined)
// })

// test('pass when passing any expectations', () => {
//   const s = createSatisfier([or({ a: 1 }, { b: 2 })])
//   t.strictEqual(s.exec([{ a: 1 }]), undefined)
//   t.strictEqual(s.exec([{ b: 2 }]), undefined)
// })
