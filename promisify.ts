import type { λ } from "./types.ts";

/**
 * Turns a function accepting a callback into a function returning a promise.
 * You can specify in which parameter (if any) the callback expects to receive
 * a result and in which it expects an error.
 * Pass `null` to `resultIndex` or `errorIndex` if no result or errors are
 * passed to the callback. By default the first argument passed to the callback
 * is interpreted as result and none of the arguments as error (if the function
 * accepting the callback throws or rejects, that will still result in the
 * promisified function rejecting).
 *
 * The `callbackFirst` property allows passing additional parameters after the
 * callback and `callbackLast` will pass additional parameters before the
 * callback.
 *
 * @param withCallback - The function accepting a callback that you want to turn
 *     into a function returning a promise.
 * @param resultIndex - The index of the parameter of the callback that contains
 *     the result. Defaults to `0`.
 *     Pass `null` if the callback doesn't receive a result.
 * @param errorIndex - The index of the parameter of the callback that contains
 *     an error. Pass `null` if the callback never receives an error.
 *     Defaults to `null`.
 *
 * @example
 * ```
 * const notify = (cb: (msg: string) => void) => { msg('something') }
 * const waitForMessage = promisify(notify)
 * await waitForMessage()  // -> 'something'
 *
 * // here result is passed at index 1 and errors at index 0.
 * const callbackAPI = (cb: (error?: Error, data?: unknown) => void) => {}
 * const asyncAPI = promisify(callbackAPI, 1, 0)
 * ```
 *
 * @example
 * ```
 * const sleep = promisify(setTimeout).callbackFirst
 * await sleep(200)
 * ```
 *
 * @example
 * ```
 * const fs = require('node:fs');
 * const stat = promisify(fs.stat, 1, 0).callbackLast
 *
 * try {
 *   const stats = await stat('.');
 *   console.log(`This directory is owned by ${stats.uid}`);
 * } catch (err) {
 *   console.error(err)
 * }
 * ```
 */
const promisify = <T extends λ, N extends number | null = 0>(
  withCallback: T,
  resultIndex?: N,
  errorIndex: number | null = null,
): Promisified<T, N> => {
  const promisified = (append?: boolean) =>
    (...additional: unknown[]) =>
      new Promise<any>((res, rej) =>
        withCallback(...append ? additional : [], (...args: unknown[]) => {
          const error = typeof errorIndex === "number"
            ? args[errorIndex]
            : null;
          if (error !== undefined && error !== null) return rej(error);
          res(resultIndex === null ? undefined : args[resultIndex ?? 0]);
        }, ...!append ? additional : [])?.catch?.(rej)
      );

  return Object.assign(promisified(), {
    callbackFirst: promisified(false),
    callbackLast: promisified(true),
  }) as any;
};

export default promisify;

type Promisified<T extends λ, N extends number | null> =
  & (() => Promise<
    CallbackResult<Callback<T>, N>
  >)
  & {
    callbackFirst: (...args: Trailing<Parameters<T>>) => Promise<
      CallbackResult<Callback<T>, N>
    >;
    callbackLast: (...args: Leading<Parameters<T>>) => Promise<
      CallbackResult<Callback<T>, N>
    >;
  };

type Callback<T extends λ> = FindCallback<Parameters<T>>;

type FindCallback<T extends unknown[]> = T extends [infer F, ...infer R]
  ? (F extends λ ? F : FindCallback<R>)
  : never;

type CallbackResult<T extends λ, N extends number | null> = N extends number
  ? (Parameters<T>[N] extends undefined ? void : Parameters<T>[N])
  : void;

type Leading<T extends unknown[]> = T extends [...infer L, λ] ? L : [];

type Trailing<T extends unknown[]> = T extends [λ, ...infer T] ? T
  : [];
