import { IsEvenLength, Surround } from "./types.ts";
import { assert } from "./except.ts";

/**
 * Surrounds the `str` with `surrounding`. `surrounding` must have an even length.
 *
 * @example
 * ```
 * surround("foo", "()")      // "(foo)"
 * surround("foo", "({[]})")  // "({[foo]})"
 * ```
 */
export const surround = <A extends string, B extends string>(
  str: A,
  surrounding: B,
): B extends "" ? A
  : IsEvenLength<B> extends true ? Surround<A, B>
  : never => {
  if (typeof surrounding !== "string") return str as any;
  assert(
    surrounding.length % 2 === 0,
    "surrounding string must have even length",
  );
  const half = surrounding.length / 2;
  return `${surrounding.slice(0, half)}${str}${
    surrounding.slice(half, half * 2)
  }` as any;
};

export default surround;
