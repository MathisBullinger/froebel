import type { λ } from "./types.ts";
import { assert } from "./internal/except.ts";

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
 * If `opt.weak` is `true`, non-primitive cache keys are stored in a WeakMap.
 * This behavior might for example be useful if you want to memoize some
 * calculation including a DOM Node without holding on to a reference of that
 * node.
 * Using weak keys prohibits setting a `limit`.
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
 * console.log( calc(1, 2) )
 * // calculate 1 + 2
 * // 3
 * console.log( calc(20, 5) )
 * // calculate 20 + 5
 * // 25
 * console.log( calc(20, 5) )
 * // 25
 * console.log( calc(1, 2) )
 * // 3
 *
 * calc.cache.clear()
 * console.log( calc(1, 2) )
 * // calculate 1 + 2
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
const memoize = <T extends λ, K = string, W extends boolean = false>(
  fun: T,
  opt: {
    /**
     * How the cache key is computed. Defaults to `JSON.stringify`ing the arguments.
     */
    key?: (...args: Parameters<T>) => K;
    /**
     * The maximum number of results that can be kept in cache before discarding the oldest result.
     */
    limit?: number;
    /**
     * Store non-primitive cache keys in a WeakMap.
     */
    weak?: W;
  } = {},
): T & {
  cache: W extends false ? Map<K, ReturnType<T>> : Cache<K, ReturnType<T>>;
} => {
  opt.key ??= (...args) => JSON.stringify(args) as any;

  const cache = opt.weak
    ? new Cache<K, ReturnType<T>>()
    : new Map<K, ReturnType<T>>();

  if (!Number.isFinite(opt.limit)) opt.limit = -1;

  assert(
    !opt.weak || opt.limit! <= 0,
    "can't set a limit when using weak keys",
  );

  const hasLimit = (_cache: unknown): _cache is Map<unknown, unknown> =>
    opt.limit! > 0;

  return Object.assign(
    (...args: Parameters<T>) => {
      const k = opt.key!(...args);
      if (cache.has(k)) return cache.get(k);
      if (hasLimit(cache) && opt.limit! <= cache.size) {
        const n = cache.size - opt.limit! + 1;
        for (let i = 0; i < n; i++) cache.delete(cache.keys().next().value);
      }
      const res = fun(...args);
      cache.set(k, res);
      return res;
    },
    {
      cache,
    },
  ) as any;
};

export default memoize;

class Cache<K, V> {
  #primitives = new Map();
  #objects = new (globalThis.WeakMap ?? Map)();

  #getMap(key: K): WeakMap<any, any> {
    if (typeof key === "object" && key !== null) return this.#objects;
    return this.#primitives;
  }

  delete(key: K) {
    return this.#getMap(key).delete(key);
  }

  has(key: K) {
    return this.#getMap(key).has(key);
  }

  get(key: K): V | undefined {
    return this.#getMap(key).get(key);
  }

  set(key: K, value: V) {
    this.#getMap(key).set(key, value);
  }
}
