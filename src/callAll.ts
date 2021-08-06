import type { λ } from './types'

/**
 * Take a list of functions that take the same parameters and call them all
 * with the provided arguments.
 *
 * @example
 * ```
 * const mult = (a: number, b: number) => a * b
 * const div  = (a: number, b: number) => a / b
 *
 * // prints: [8, 2]
 * console.log( callAll([mult, div], 4, 2) )
 * ```
 */
const callAll = <F extends λ<T>[], T extends any[]>(
  list: F,
  ...args: Parameters<F[0]>
): ReturnType<F[number]>[] => list.map(cb => cb?.(...args)) ?? []

export default callAll
