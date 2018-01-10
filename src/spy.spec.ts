import { test } from 'ava'

import { spy } from './index'
import { tersify } from 'tersify';

function increment(x: number) { return ++x }

test('record argument and result', t => {
  const { fn, calls } = spy(increment)

  t.is(fn(1), 2)

  t.is(calls.length, 1)
  const cr = calls[0]
  t.is(cr.inputs[0], 1)
  t.is(cr.output, 2)
})

function throws() { throw new Error('thrown') }

test('capture error', t => {
  const { fn, calls } = spy(throws)

  const err = t.throws(fn)

  t.is(calls.length, 1)
  t.is(calls[0].error, err)
})

test('tersify for sync call', async t => {
  const { fn, calls } = spy(increment)

  t.is(fn(1), 2)
  const record = await calls[0].getCallRecord()
  t.is(record.tersify(), `{ inputs: [1], output: 2, error: undefined, asyncOutput: undefined }`)
})

// this is not a valid test as the package is used for boundary testing.
// Boundary function are not expected to make changes to the arguments
test.skip('argument should be immutable', t => {
  function mutate(x) { x.a++ }
  const { fn, calls } = spy(mutate)
  fn({ a: 1 })
  const entry = calls[0]
  t.is(entry.inputs[0].a, 1)
})

function invoke(x, cb) { cb(x) }

test('callback are spied', async t => {
  const { fn, calls } = spy(invoke)
  fn(1, x => t.is(x, 1))
  const entry = calls[0]
  t.is(entry.inputs[0], 1)
  return entry.then(x => t.deepEqual(x, [1]))
})

function callbackOnLiterial(options) {
  options.success(++options.data)
}

test('spec on jquery style callback', async t => {
  const { fn, calls } = spy(callbackOnLiterial)
  fn({
    data: 1,
    success: (result) => {
      t.is(result, 2)
    }
  })

  const output = await calls[0]
  t.is(output[0], 2)
})


const resolve = x => Promise.resolve(x)

test('then() will receive result from promise', async t => {
  const { fn, calls } = spy(resolve)
  // tslint:disable-next-line
  fn(1)
  t.is(await calls[0], 1)
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

test('tersify for sync call', async t => {
  const { fn, calls } = spy(reject)


  return fn(1).catch(actualError => {
    console.log(tersify(actualError))
    return calls[0].getCallRecord()
      .then(record => {
        t.is(record.tersify(), `{ inputs: [1], output: {}, error: undefined, asyncError: { message: '1' } }`)
      })
  })
})

