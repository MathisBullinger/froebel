/** Checks if `value` looks like a promise. */
const isPromise = <T = any>(value: unknown): value is Promise<T> =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as any).then === "function";

export default isPromise;

/**
 * Checks if `value` is not a promise.
 *
 * @example
 * ```
 * (value: number | Promise<unknown>) => {
 *   if (isNotPromise(value)) return value / 2
 * }
 * ```
 */
export const isNotPromise = <T>(value: T): value is Exclude<T, Promise<any>> =>
  !isPromise(value);
