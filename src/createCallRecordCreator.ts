import { createCallRecord } from './createCallRecord'
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
        return createCallRecord({
          ...callEntry, asyncOutput
        })
      }, asyncError => {
        return createCallRecord({
          ...callEntry, asyncError
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
