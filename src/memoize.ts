import type { λ } from './types'

/**
 * Returns a copy of `fun` that remembers its result for any given arguments and
 * only invokes `fun` for unknown arguments.
 *
 * The function's cache is available at `memoized.cache`.
 *
 * @param fun      The function to be memoized.
 * @param cacheKey How the cache key is computed. Defaults to `JSON.stringify`ing the arguments.
 * @returns        The memoized function.
 */
const memoize = <T extends λ, K = string>(
  fun: T,
  cacheKey: (...args: Parameters<T>) => K = (...args) =>
    JSON.stringify(args) as any
): T & { cache: Map<K, ReturnType<T>> } => {
  const cache = new Map<K, ReturnType<T>>()

  return Object.assign(
    (...args: Parameters<T>) => {
      const key = cacheKey(...args)
      if (cache.has(key)) return cache.get(key)
      const res = fun(...args)
      cache.set(key, res)
      return res
    },
    {
      cache,
    }
  ) as any
}

export default memoize
