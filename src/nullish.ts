/** Checks if `value` is nullish. Literal types are narrowed accordingly. */
export const nullish = <T>(value: T): value is Nullish<T> =>
  value === undefined || value === null

type Nullish<T> = PickNullish<T> extends never
  ? Extract<T, undefined | null>
  : PickNullish<T>

type PickNullish<T> =
  | (null extends T ? null : never)
  | (undefined extends T ? undefined : never)

/**
 * Checks if `value` is not nullish. Literal types are narrowed accordingly.
 *
 * @example
 * ```
 * const nums = (...values: (number | undefined)[]): number[] => values.filter(notNullish)
 * ```
 */
export const notNullish = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined
