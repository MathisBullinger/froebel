/**
 * Checks if `a` and `b` are structurally equal using the following algorithm:
 *
 * - primitives are compared by value
 * - functions are compared by reference
 * - objects (including arrays) are checked to have the same properties and
 *   their values are compared recursively using the same algorithm
 */
export default function equal(a: unknown, b: unknown): boolean {
  if (typeof a !== 'object' && typeof b !== 'object') return a === b
  if ((typeof a === 'object') !== (typeof b === 'object')) return false
  if (a === b) return true // null or ref equality
  if (a === null || b === null) return false
  if (Array.isArray(a) !== Array.isArray(b)) return false

  if (Object.keys(a as any).length !== Object.keys(b as any).length)
    return false

  return Object.entries(a as any).every(
    ([k, v]) => k in (b as any) && equal(v, (b as any)[k])
  )
}
