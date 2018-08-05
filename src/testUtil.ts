import t from 'assert'

import { tersify } from 'tersify'

export function assertRegExp(actual, path, regex, actualValue) {
  t.strictEqual(actual.length, 1)
  t.deepStrictEqual(actual[0].path, path)
  t.strictEqual(actual[0].expected.source, regex.source)
  t.deepStrictEqual(actual[0].actual, actualValue)
}

export function assertExec(entry, path, expected, actual) {
  t.deepStrictEqual(entry.path, path)
  if (typeof entry.expected === 'function')
    t.strictEqual(tersify(entry.expected), tersify(expected))
  else
    t.deepStrictEqual(entry.expected, expected)
  t.deepStrictEqual(entry.actual, actual)
}
