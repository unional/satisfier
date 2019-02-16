import {
  tersible,
  // @ts-ignore
  Tersify,
  // @ts-ignore
  TersifyOptions
} from 'tersify'

export function isInOpenInterval(start: number, end: number) {
  return tersible((a: any) => a > start && (a < end), () => `(${start}...${end})`)
}
export function isInClosedInterval(start: number, end: number) {
  return tersible((a: any) => a >= start && a <= end, () => `[${start}...${end}]`)
}

export function isInLeftClosedInterval(start: number, end: number) {
  return tersible((a: any) => a >= start && (a < end), () => `[${start}...${end})`)
}

export function isInRightClosedInterval(start: number, end: number) {
  return tersible((a: any) => a > start && a <= end, () => `(${start}...${end}]`)
}
