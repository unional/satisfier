import {
  tersible,
  // @ts-ignore
  Tersify,
  // @ts-ignore
  TersifyOptions
} from 'tersify'

export function isInRange(start: number, end: number) {
  return tersible(a => a >= start && a <= end, () => `[${start}...${end}]`)
}
