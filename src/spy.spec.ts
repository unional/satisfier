import { test } from 'ava'

import { spy } from './index'

function increment(x: number) { return ++x }

test('record argument and result', t => {
  const { fn, calls } = spy(increment)

  t.is(fn(1), 2)

  t.is(calls.length, 1)
  const cr = calls[0]
  t.is(cr.arguments[0], 1)
  t.is(cr.result, 2)
})

function throws() { throw new Error('thrown') }

test('capture error', t => {
  const { fn, calls } = spy(throws)

  const err = t.throws(fn)

  t.is(calls.length, 1)
  t.is(calls[0].error, err)
})

// this is not a valid test as the package is used for boundary testing.
// Boundary function are not expected to make changes to the arguments
test.skip('argument should be immutable', t => {
  function mutate(x) { x.a++ }
  const { fn, calls } = spy(mutate)
  fn({ a: 1 })
  const cr = calls[0]
  t.is(cr.arguments[0].a, 1)
})

function invoke(x, cb) { cb(x) }

test('callback are spied', t => {
  const { fn, calls } = spy(invoke)
  fn(1, x => t.is(x, 1))
  const cr = calls[0]
  t.is(cr.arguments[0], 1)
  return cr.then(r => t.deepEqual(r, [1]))
})

function callbackOnLiterial(options) {
  options.success(++options.data)
}
test('spec on jquery style callback', t => {
  const { fn, calls } = spy(callbackOnLiterial)
  fn({
    data: 1,
    success: (result) => {
      t.is(result, 2)
    }
  })

  const call = calls[0]
  return call.then(response => t.is(response[0], 2))
})


const resolve = x => Promise.resolve(x)

test('then() will receive result from promise', t => {
  const { fn, calls } = spy(resolve)
  // tslint:disable-next-line
  fn(1)
  return calls[0].then(x => t.is(x, 1))
})

test('result from promise can be retrieved from await on the call', async t => {
  const { fn, calls } = spy(resolve)
  // tslint:disable-next-line
  fn(1)
  t.is(await calls[0], 1)
})

const reject = x => Promise.reject(new Error(x))

test('catch() will receive error thrown by promise', async t => {
  const { fn, calls } = spy(reject)
  // tslint:disable-next-line
  return fn(1).catch(actualError => {
    return calls[0].catch(err => {
      t.is(err, actualError)
    })
  })
})
