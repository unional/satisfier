import { createSatisfier } from './createSatisfier.js'
import { Predicate } from './interfaces.js'

export type TargetedExpectation<T = any> = (
  T extends Array<infer R> ? Array<TargetedExpectation<R>> :
  T extends object ? { [k in keyof T]?: TargetedExpectation<T[k]> } :
  T
) | Predicate<T>

export function satisfies<T = any>(actual: T, expected: TargetedExpectation<T>): boolean {
  return createSatisfier(expected as any).test(actual)
}
