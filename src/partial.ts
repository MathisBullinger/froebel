/**
 * Partially apply a function.
 *
 * @example
 * ```
 * const divide = (dividend: number, divisor: number) => dividend / divisor
 *
 * // (divisor: number) => number
 * const oneOver = partial(divide, 1)
 *
 * // prints: 0.25
 * console.log(oneOver(4))
 * ```
 */
const partial =
  <T extends λ, PL extends PartialList<Parameters<T>>>(fun: T, ...argsL: PL) =>
  (
    ...argsR: Parameters<T> extends [...PL, ...infer PR] ? PR : never
  ): ReturnType<T> =>
    fun(...argsL, ...argsR)

export default partial
