import { capitalize } from "./case.ts";
import type { Prefix, StringCase } from "./types.ts";

/**
 * Returns `str` prefixed with `prefix`. Optionally, allows prefxing in camel
 * case, i.e. `prefix('foo', 'bar', 'camel') => 'fooBar'`, or snake case, i.e.
 * `prefix('foo', 'bar', 'snake') => 'foo_bar'`.
 *
 * The result is strictly typed, so `prefix('foo', 'bar')` will return the type
 * `'foobar'`, not just a generic `string`.
 */
const prefix = <
  T0 extends string,
  T1 extends string,
  C extends StringCase | void = void,
>(
  prefix: T0,
  str: T1,
  caseMod?: C,
): Prefix<T1, T0, C> =>
  `${prefix}${caseMod === "snake" ? "_" : ""}${
    caseMod === "camel" ? capitalize(str) : str
  }` as any;

export default prefix;
