import { createSatisfier } from './createSatisfier2';
import { Diff } from './interfaces';

/**
 * Check if value satisfy any one of the specified expectations.
 */
export function or(...expectations: any[]) {
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
  }
}
