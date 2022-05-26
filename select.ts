export const none = Symbol("value.none");

/**
 * Returns the value in `obj` at `path`. If the given path does not exist,
 * the symbol `none` is returned.
 */
const pick = <T, P extends (string | number | symbol)[]>(
  obj: T,
  ...path: P
): PickPath<T, P> =>
  path.length === 0
    ? obj
    : typeof obj !== "object" || obj === null || !(path[0] in obj)
    ? none
    : (pick(obj[path[0] as keyof T], ...path.slice(1)) as any);

export default pick;

type PickPath<T, P extends (string | number | symbol)[]> = P extends [] ? T
  : P[0] extends keyof T
    ? PickPath<T[P[0]], P extends [any, ...infer R] ? R : []>
  : unknown extends T ? unknown
  : typeof none;
