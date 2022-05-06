import { tersible } from 'tersify'

export function isInRange(start: number, end: number) {
  return tersible((a: any) => a >= start && a <= end, () => `[${start}...${end}]`)
}
