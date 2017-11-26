export function isInOpenInterval(start: number, end: number) {
  return a => a > start && a < end
}
export function isInClosedInterval(start: number, end: number) {
  return a => a >= start && a <= end
}

export function isInLeftClosedInterval(start: number, end: number) {
  return a => a >= start && a < end
}

export function isInRightClosedInterval(start: number, end: number) {
  return a => a > start && a <= end
}
