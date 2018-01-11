import { CallRecord } from './CallRecord'
import { CallEntry } from './CallEntry'

export function createCallRecordCreator(args: any[]) {
  let resolve
  let reject
  const p = new Promise((a, r) => {
    resolve = a
    reject = r
  })
  const callEntry = Object.assign(p, {
    inputs: args,
    getCallRecord() {
      const inputs = trimCallbacks(callEntry.inputs)
      const { output, error } = callEntry
      return callEntry.then(asyncOutput => {
        return CallRecord.create({
          inputs, output, error, asyncOutput
        })
      }, asyncError => {
        return CallRecord.create({
          inputs, output, error, asyncError
        })
      })
    }
  }) as CallEntry

  return {
    resolve,
    reject,
    callEntry
  }
}

const callbackLiteral = { tersify() { return 'callback' } }

function trimCallbacks(inputs: any[]) {
  return inputs.map(arg => {
    if (typeof arg === 'function') {
      return callbackLiteral
    }
    if (typeof arg === 'object') {
      Object.keys(arg).forEach(key => {
        if (typeof arg[key] === 'function') {
          arg[key] = callbackLiteral
        }
      })
    }
    return arg
  })
}
