import callAll from "./callAll.ts";
import type { λ } from "./types.ts";

/**
 * Given a list of functions that accept the same parameters, returns a function
 * that takes these parameters and invokes all of the given functions.
 *
 * The returned function returns a promise that resolves once all functions
 * returned/resolved and rejects if any of the functions throws/rejects - but
 * only after all returned promises have been settled.
 */
const bundle =
  <T extends unknown[]>(...funs: (λ<T> | undefined)[]) =>
  async (...args: T): Promise<void> => {
    const res = await Promise.allSettled(
      funs.map((f) => (async () => await f?.(...args))()),
    );
    res.forEach((v) => {
      if (v.status === "rejected") throw v.reason;
    });
  };

/**
 * Same as {@link bundle}, but return synchronously.
 *
 * If any of the functions throws an error synchronously, none of the functions
 * after it will be invoked and the error will propagate.
 */
export const bundleSync = <T extends unknown[]>(
  ...funs: (λ<T> | undefined)[]
) =>
(...args: T) =>
  void callAll(funs.filter((f) => f !== undefined) as λ<T>[], ...args);

export default bundle;
