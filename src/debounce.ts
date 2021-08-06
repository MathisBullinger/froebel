import type { λ } from './types'

export const cancel = Symbol('debounce.cancel')

/**
 * Creates a debounced function that delays invoking `fun` until `ms` milliseconds
 * have passed since the last invocation of the debounced function.
 *
 * `fun` is invoked with the last arguments passed to the debounced function.
 *
 * Calling `[debounce.cancel]()` on the debounced function with cancel the next
 * scheduled invocation of `fun`.
 */
const debounce = Object.assign(
  (fun: λ, ms: number) => {
    let toId: any
    return Object.assign(
      (...args: any[]) => {
        clearTimeout(toId)
        toId = setTimeout(() => fun(...args), ms)
      },
      { [cancel]: () => clearTimeout(toId) }
    ) as any
  },
  { cancel }
) as (<T extends λ>(
  fun: T,
  ms: number
) => λ<Parameters<T>, void> & { [cancel](): void }) & {
  cancel: typeof cancel
}

export default debounce
