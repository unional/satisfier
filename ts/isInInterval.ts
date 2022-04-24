import { Tersible, tersible } from 'tersify'
import { Predicate } from './interfaces'

export function isInOpenInterval(start: number, end: number): Tersible<Predicate> {
  return tersible((a: any) => a > start && (a < end), () => `(${start}...${end})`)
}
export function isInClosedInterval(start: number, end: number): Tersible<Predicate> {
  return tersible((a: any) => a >= start && a <= end, () => `[${start}...${end}]`)
}

export function isInLeftClosedInterval(start: number, end: number): Tersible<Predicate> {
  return tersible((a: any) => a >= start && (a < end), () => `[${start}...${end})`)
}

export function isInRightClosedInterval(start: number, end: number): Tersible<Predicate> {
  return tersible((a: any) => a > start && a <= end, () => `(${start}...${end}]`)
}
