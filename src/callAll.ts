import type { λ } from "./types.ts";

/**
 * Take a list of functions that accept the same parameters and call them all
 * with the provided arguments.
 *
 * @example
 * ```
 * const mult = (a: number, b: number) => a * b
 * const div  = (a: number, b: number) => a / b
 *
 * // prints: [8, 2]
 * console.log( callAll([mult, div], 4, 2) )
 * ```
 */
const callAll = <P extends any[], F extends λ<P>[]>(
  funs: [...F],
  ...args: P
): ReturnTypes<F> => (funs.map((cb) => cb(...args)) ?? []) as any;

type ReturnTypes<T extends λ[]> = {
  [K in keyof T]: T[K] extends λ<any, infer I> ? I : never;
};

export default callAll;
