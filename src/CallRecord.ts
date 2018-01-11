import {
  tersible,
  tersify,
  // @ts-ignore
  Tersify,
  // @ts-ignore
  TersifyOptions
} from 'tersify'

export interface CallRecordData {
  inputs: any[],
  output: any,
  error: any,
  asyncOutput?: any,
  asyncError?: any
}

export interface CallRecord {
  inputs: any[],
  output: any,
  error: any,
  asyncOutput: any,
  asyncError: any,
  tersify(): string
}

export const CallRecord = {
  /**
   * Creates a call record object.
   */
  create({ inputs, output, error, asyncOutput, asyncError }: CallRecordData) {
    return tersible({ inputs, output, error, asyncOutput, asyncError },
      () => {
        const obj = { inputs, output, error } as CallRecord
        if (asyncError !== undefined) obj.asyncError = asyncError
        if (asyncOutput !== undefined) obj.asyncOutput = asyncOutput
        return tersify(obj, { maxLength: Infinity })
      })
  }
}
