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
      return callEntry.then(asyncOutput => {
        return CallRecord.create({
          ...callEntry, asyncOutput
        })
      }, asyncError => {
        return CallRecord.create({
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
