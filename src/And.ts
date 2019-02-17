import { createSatisfier } from './createSatisfier2';
import { Diff } from './interfaces';

/**
 * Check if value satisfies all of the specified expectations.
 */
export function and(...expectations: any[]) {
  // TODO determine how does this different than combining the object?
  // Is it possible to combine different type e.g. `string` | `object`?
  // Doesn't seem to make sense.
  const satisfiers = expectations.map(createSatisfier)
  return function or(actual: any, path: Diff['path']) {
    // TODO check actual type and process accordingly
    const diffs: Diff[] = []
    if (satisfiers.some(s => {
      const d = s.exec(actual)
      if (!d) return true
      diffs.push(...d)
      return false
    })) {
      return true
    }
    else {
      return diffs
    }
    // let diff: Diff[] | undefined
    // this.satisfiers.some(s => {
    //   diff = s.exec(actual)
    //   if (diff) {
    //     diff.forEach(d => d.path = [...path, ...d.path])
    //   }

    //   return !!diff
    // })
    // return diff
  }
}

