import { Tersible, tersible } from 'tersify'
import { Predicate } from './interfaces'

export function isInRange(start: number, end: number): Tersible<Predicate> {
  return tersible((a: any) => a >= start && a <= end, () => `[${start}...${end}]`)
}
