import { Take_, λ } from "./types.ts";

/**
 * Turns `fun` into a unary function (a function that only accepts one
 * argument).
 *
 * Note: `fun` must accept at least one argument and must not require more than
 * one argument.
 *
 * @example
 * ```
 * ['1', '2', '3'].map(unary(parseInt))  // -> [1, 2, 3]
 * ```
 */
const unary = <T extends λ<[any]>>(
  fun: Parameters<T> extends [] ? never : T,
): Unary<T> => ((arg: unknown) => (fun as any)(arg)) as any;

export default unary;

type Unary<T extends λ<[any]>> = λ<Take_<Parameters<T>, 1>, ReturnType<T>>;
