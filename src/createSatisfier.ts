import esprima = require('esprima')
import RandExp = require('randexp')

import { Struct, Expecter, SatisfierExec } from './interfaces'

/**
 * creates a satisfier
 * @param expecter All properties can be a value which will be compared to the same property in `actual`, RegExp, or a predicate function that will be used to check against the property.
 */
export function createSatisfier<T extends Struct>(expecter: Expecter<T>): {
  test(actual: T): boolean;
  exec(actual: T): SatisfierExec[] | null;
  generate(): T
} {
  function test(actual: T) {
    return exec(actual) === null
  }
  /**
   * Check if `actual` satisfies the expected criteria.
   */
  function exec(actual: T) {
    if (Array.isArray(actual)) {
      const diff: SatisfierExec[] = []
      if (Array.isArray(expecter)) {
        expecter.forEach((e, i) => {
          diff.push(...detectDiff(actual[i], e, [`[${i}]`]))
        })
      }
      else {
        actual.forEach((a, i) => {
          diff.push(...detectDiff(a, expecter, [`[${i}]`]))
        })
      }
      return diff.length === 0 ? null : diff
    }
    const diff = detectDiff(actual, expecter)
    return diff.length === 0 ? null : diff
  }
  function generate() {
    return generateExample(expecter)
  }
  return {
    test,
    exec,
    generate
  }
}

function detectDiff(actual, expected, path: string[] = []) {
  const diff: SatisfierExec[] = []
  const expectedType = typeof expected
  if (expectedType === 'function') {
    if (!(expected as Function)(actual)) {
      diff.push({
        path,
        expected,
        actual
      })
    }
  }
  else if (expectedType === 'boolean' || expectedType === 'number' || expectedType === 'string' || actual === undefined) {
    if (expected !== actual)
      diff.push({
        path,
        expected,
        actual
      })
  }
  else if (expected instanceof RegExp) {
    if (!expected.test(actual)) {
      diff.push({
        path,
        expected,
        actual
      })
    }
  }
  else if (Array.isArray(expected)) {
    expected.forEach((e, i) => {
      const actualValue = actual[i]
      diff.push(...detectDiff(actualValue, e, path.concat([`[${i}]`])))
    })
  }
  else {
    // expected is object. If actual is not, then it is diff.
    const actualType = typeof actual
    if (actualType === 'boolean' || actualType === 'string' || actualType === 'number')
      diff.push({
        path,
        expected,
        actual
      })
    else
      Object.keys(expected).forEach(k => {
        diff.push(...detectDiff(actual[k], expected[k], path.concat([k])))
      })
  }
  return diff
}

function generateExample<T>(expecter: Expecter<T>): T {
  const type = typeof expecter
  if (type === 'number' || type === 'string' || type === 'boolean')
    return expecter as T
  if (type === 'function')
    return generateFunctionExample(expecter) as any

  if (expecter instanceof RegExp)
    return new RandExp(expecter).gen()
  if (Array.isArray(expecter)) {
    return expecter.map(generateExample) as any
  }

  const example: any = {}
  Object.keys(expecter).forEach(k => {
    example[k] = generateExample(expecter[k])
  })
  return example
}

function generateFunctionExample(predicate) {
  const predicateAST = getPredicateAST(predicate)
  // console.log(predicateAST)
  const paramId = getParamId(predicateAST)
  if (paramId === undefined) {
    // the predicate doesn't take any input.
    // This should only happen during tests of `satisfier`.
    return undefined
  }

  // one strategy is to back trace from all return statements.
  // from there reconstruct the shape of the input.

  // the following is sufficent to determine a > 0
  // so no futher processing is needed.
  // This means I can go depth first and back trace per return statement.
  // Once I found one solution, I can stop.
  // {
  //   "type": "ReturnStatement",
  //     "argument": {
  //     "type": "BinaryExpression",
  //       "operator": ">",
  //         "left": {
  //       "type": "Identifier",
  //         "name": "a"
  //     },
  //     "right": {
  //       "type": "Literal",
  //         "value": 0,
  //           "raw": "0"
  //     }
  //   }
  // }

  return null
}

function getPredicateAST(predicate) {
  const program = Function.toString.call(predicate)
  console.log(program)
  const script = esprima.parseScript(`const predicate = ${program}`)
  return script.body[0]['declarations'][0].init
}

function getParamId(predicateAST) {
  return predicateAST.params.length > 0 ? predicateAST.params[0].name : undefined
}

// function getReturnStatement(predicateAST) {
//   return predicateAST.body.body.filter(b => b.type === esprima.Syntax.ReturnStatement)
// }
