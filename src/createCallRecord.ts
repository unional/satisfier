import { tersible, tersify } from 'tersify'

export interface CallRecordPartial {
  inputs: any[],
  output: any,
  error: any,
  asyncOutput?: any,
  asyncError?: any,
}

/**
 * Creates a call record object.
 */
export function createCallRecord(record: CallRecordPartial) {
  tersible(record, () => tersify(record, { maxLength: Infinity }))
}
