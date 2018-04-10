import t from 'assert'

import { tersify } from 'tersify'

export function assertRegExp(actual, path, regex, actualValue) {
  t.equal(actual.length, 1)
  t.deepEqual(actual[0].path, path)
  t.equal(actual[0].expected.source, regex.source)
  t.deepEqual(actual[0].actual, actualValue)
}

export function assertExec(t, entry, path, expected, actual) {
  t.deepEqual(entry.path, path)
  if (typeof entry.expected === 'function')
    t.equal(tersify(entry.expected), tersify(expected))
  else
    t.deepEqual(entry.expected, expected)
  t.deepEqual(entry.actual, actual)
}
