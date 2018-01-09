import { createCallRecordCreator } from './createCallRecordCreator'
import { CallRecord } from './interfaces'

export interface Spy<T> {
  calls: ReadonlyArray<CallRecord>,
  /**
   * the spied function.
   */
  fn: T
}

function spyOnCallback(fn) {
  let callback
  return Object.assign(
    (...args) => {
      // callback is always assigned as it is used internally.
      callback(...args)
      fn(...args)
    }, {
      called(cb) {
        callback = cb
      }
    })
}

/**
 * Spy on function that uses callback.
 */
export function spy<T extends Function>(fn: T): Spy<T> {
  const calls: CallRecord[] = []
  const spied: T = function (...args) {
    const creator = createCallRecordCreator(args)
    calls.push(creator.callRecord)

    const spiedCallbacks: any[] = []
    const spiedArgs = args.map(arg => {
      if (typeof arg === 'function') {
        const spied = spyOnCallback(arg)
        spiedCallbacks.push(spied)
        return spied
      }
      if (typeof arg === 'object') {
        Object.keys(arg).forEach(key => {
          if (typeof arg[key] === 'function') {
            const spied = spyOnCallback(arg[key])
            spiedCallbacks.push(spied)
            arg[key] = spied
          }
        })
      }
      return arg
    })
    if (spiedCallbacks.length > 0) {
      new Promise(a => {
        spiedCallbacks.forEach(s => {
          s.called((...results) => {
            a(results)
          })
        })
      }).then(creator.resolve, creator.reject)

      return fn(...spiedArgs)
    }
    else {
      try {
        const result = fn(...args)
        if (result && typeof result.then === 'function')
          result.then(creator.resolve, creator.reject)
        creator.callRecord.result = result
        return result
      }
      catch (error) {
        creator.callRecord.error = error
        throw error
      }
    }
  } as any

  return {
    calls,
    fn: spied
  }
}
