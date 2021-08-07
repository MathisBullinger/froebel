import type { λ } from './types'

/**
 * Given a list of functions that accept the same parameters, returns a function
 * that given these arguments returns the result of the first function whose
 * result is not nullish.
 *
 * This is equivalent to chaining together invocations of the passed in
 * functions with the given arguments with nullish coalescing _(`??`)_ operators.
 *
 * @example
 * ```
 * const isAdult   = (age: number) => { if (n >= 18) return 'adult' }
 * const isToddler = (age: number) => { if (n <= 3) return 'toddler' }
 *
 * const ageGroup = nullishChain(isAdult, isToddler, () => 'child')
 *
 * // this is functionally equivalent to:
 * const ageGroup = age => isAdult(age) ?? isToddler(age) ?? 'child'
 *
 * ageGroup(1)  // prints: 'toddler'
 * ageGroup(10) // prints: 'child'
 * ageGroup(50) // prints: 'adult'
 * ```
 */
export const nullishChain =
  <FF extends λ, FR extends λ<Parameters<FF>>[]>(
    ...[fun, ...rest]: [FF, ...FR] | []
  ) =>
  (...args: Parameters<FF>): ReturnType<FF | FR[number]> | undefined =>
    !fun ? undefined : fun(...args) ?? nullishChain(...(rest as any))(...args)
