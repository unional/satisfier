import { tersible, tersify } from 'tersify'
import { createSatisfier } from './createSatisfier.js'

/**
 * Check if every entry in the array satisfies the expectation.
 * @param expectation expectation
 */
export function every(expectation: any) {
  const s = createSatisfier(expectation)
  return tersible((e: any) => e && Array.isArray(e) && e.reduce((p, v, i) => {
    const d = s.exec(v)
    if (d) p.push(...d.map(d => {
      d.path.unshift(i)
      return d
    }))
    return p
  }, []), () => `every(${tersify(expectation)})`)
}
