/** Checks if its first argument look like a promise. */
const isPromise = <T = any>(value: unknown): value is Promise<T> =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as any).then === 'function'

export default isPromise
