export const none = Symbol("value.none");

/**
 * Returns the value in `obj` at `path`. If the given path does not exist,
 * the symbol `none` is returned.
 *
 * @example
 * ```
 * // -> 'something'
 * select(
 *   { a: { deeply: [{ nested: { object: 'something' } }] } },
 *   'a', 'deeply', 0, 'nested', 'object'
 * )
 * ```
 */
const select = <
  T,
  P extends (
    AnyNarrow
  )[],
>(
  obj: T,
  ...path: P
): PickPath<T, P> =>
  path.length === 0
    ? obj
    : obj instanceof Map
    ? (obj.has(path[0]) ? select(obj.get(path[0]), ...path.slice(1)) : none)
    : typeof obj !== "object" || obj === null ||
        typeof path[0] !== "string" && typeof path[0] !== "number" &&
          typeof path[0] !== "symbol" ||
        !(path[0] in obj)
    ? none
    : (select(obj[path[0] as keyof T], ...path.slice(1)) as any);

export default select;

type AnyNarrow =
  | string
  | number
  | symbol
  | boolean
  | undefined
  | null
  | Record<string | number | symbol, unknown>;

type PickPath<T, P extends unknown[]> = P extends [] ? T
  : T extends Map<infer K, infer V>
    ? (P[0] extends K ? V | typeof none : typeof none)
  : P[0] extends keyof T
    ? PickPath<T[P[0]], P extends [unknown, ...infer R] ? R : []>
  : unknown extends T ? unknown
  : typeof none;
