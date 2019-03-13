import { tersify } from 'tersify';
import { Diff } from './interfaces';

export function formatDiffs(diffs: Diff[] | undefined) {
  if (!diffs) return ''
  return diffs.map(d => {
    const path = d.path.length === 0 ? 'subject' : `'${d.path.map(p => typeof p === 'number' ? `[${p}]` : p).join('.')}'`
    return `expect ${path} to satisfy ${tersify(d.expected)}, but received ${tersify(d.actual)}`
  }).join('\n')
}
