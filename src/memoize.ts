import type { λ } from './types'

/**
 * Returns a copy of `fun` that remembers its result for any given arguments and
 * only invokes `fun` for unknown arguments.
 *
 * The cache key is computed using the `key` function. The default `key`
 * function simply stringifies the arguments.
 *
 * If `limit` is specified, only the `limit`-last entries are kept in cache.
 *
 * The function's cache is available at `memoized.cache`.
 *
 * @param fun - The function to be memoized.
 * @param opt - Optional additional parameters.
 * @returns The memoized function.
 *
 * @example
 * ```
 * const expensiveCalculation = (a: number, b: number) => {
 *   console.log(`calculate ${a} + ${b}`)
 *   return a + b
 * }
 * const calc = memoize(expensiveCalculation)
 *
 * console.log(calc(1, 2))
 * // calculate 1 + 2
 * // 3
 * console.log(calc(20, 5))
 * // calculate 20 + 5
 * // 25
 * console.log(calc(20, 5))
 * // 25
 * console.log(calc(1, 2))
 * // 3
 * ```
 *
 * @example
 * ```
 * const logIfDifferent = memoize(
 *   (msg: string) => console.log(msg),
 *   {
 *     limit: 1,
 *     key: msg => msg
 *   }
 * )
 *
 * logIfDifferent('a')
 * logIfDifferent('a')
 * logIfDifferent('b')
 * logIfDifferent('a')
 *
 * // a
 * // b
 * // a
 * ```
 */
const memoize = <T extends λ, K = string>(
  fun: T,
  opt: {
    /**
     * How the cache key is computed. Defaults to `JSON.stringify`ing the arguments.
     */
    key?: (...args: Parameters<T>) => K
    /**
     * The maximum number of results that can be kept in cache before discarding the oldest result.
     */
    limit?: number
  } = {}
): T & { cache: Map<K, ReturnType<T>> } => {
  opt.key ??= (...args) => JSON.stringify(args) as any

  const cache = new Map<K, ReturnType<T>>()
  if (!Number.isFinite(opt.limit)) opt.limit = -1

  return Object.assign(
    (...args: Parameters<T>) => {
      const k = opt.key!(...args)
      if (cache.has(k)) return cache.get(k)
      if (opt.limit! > 0 && opt.limit! <= cache.size) {
        const n = cache.size - opt.limit! + 1
        for (let i = 0; i < n; i++) cache.delete(cache.keys().next().value)
      }
      const res = fun(...args)
      cache.set(k, res)
      return res
    },
    {
      cache,
    }
  ) as any
}

export default memoize
