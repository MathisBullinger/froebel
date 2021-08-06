import type { λ } from './types'

/**
 * Given a functions and its nth..last arguments, return a function accepting
 * arguments 0..n-1.
 *
 * @example
 * ```
 * const divide = (dividend: number, divisor: number) => dividend / divisor
 *
 * // (dividend: number) => number
 * const divideBy2 = partial(divide, 2)
 *
 * // prints: 0.5
 * console.log(divideBy2(1))
 * ```
 *
 * @example
 * ```
 * const fetchUrl = async (protocol: string, domain: string, path: string) =>
 *   await fetch(`${protocol}://${domain}/${path}`)
 *
 * const fetchRepo = forward(fetchUrl, 'github.com', 'MathisBullinger/snatchblock')
 *
 * const viaHTTPS = await fetchRepo('https')
 * ```
 */
const forward =
  <T extends λ, PR extends any[]>(fun: T, ...argsR: PR) =>
  (
    ...argsL: Parameters<T> extends [...infer PL, ...PR] ? PL : never
  ): ReturnType<T> =>
    fun(...argsL, ...argsR)

export default forward
