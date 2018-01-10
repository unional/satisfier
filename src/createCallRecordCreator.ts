import { tersify, tersible } from 'tersify'

import { CallEntry } from './interfaces'

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
      return callEntry.then(asyncOutput => {
        const { inputs, output, error } = callEntry
        return tersible({
          inputs,
          output,
          error,
          asyncOutput
        }, () => tersify({
          inputs,
          output,
          error,
          asyncOutput
        }, { maxLength: Infinity }))
      }, asyncError => {
        const { inputs, output, error } = callEntry
        return tersible({
          inputs,
          output,
          error,
          asyncError
        }, () => tersify({
          inputs,
          output,
          error,
          asyncError
        }, { maxLength: Infinity }))
      })
    }
  }) as CallEntry

  return {
    resolve,
    reject,
    callEntry
  }
}
