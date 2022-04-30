import type { λ } from './types'
import { assert } from './internal/except'

/**
 * Returns a version of the function `fun` that can only be invoked `limit` times.
 * An optional `except` function will be called with the same parameters on any
 * additional invocations.
 * If `fun` returns anything but `void` (or `Promise<void>`), supplying an
 * `except` function is mandatory.
 * The `except` function must have the same return type as `fun`, or — if `fun`
 * returns a promise — it may return the type that the promise resolves to
 * synchronously.
 * The `except` function may also throw instead of returning a value.
 */
export const limitInvocations = <T extends λ>(
  fun: T,
  limit: number,
  ...[except]: ExcS<T>
): T => {
  assert(limit >= 1, 'limit must be >= 1', RangeError)
  let invs = 0
  return ((...args: Parameters<T>) => {
    if (invs < limit) {
      invs++
      return fun(...args)
    }
    if (typeof except === 'function') return except(...args)
  }) as T
}

/**
 * Special case of {@link limitInvocations}. `fun` can only be invoked once.
 *
 * @see {@link limitInvocations}
 */
export const once = <T extends λ>(fun: T, ...[except]: ExcS<T>): T => {
  let invs = 0
  return ((...args: Parameters<T>) =>
    ++invs > 1 ? except?.(...args) : fun(...args)) as T
}

type ExcS<T extends λ> = ReturnType<T> extends void | PromiseLike<void>
  ? [except?: Exc<T>]
  : [except: Exc<T>]
type Exc<T extends λ> = λ<Parameters<T>, OptProm<ReturnType<T>>>
type OptProm<T> = T extends Promise<infer I> ? I | Promise<I> : T
