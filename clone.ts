import type { λ } from "./types.ts";

/**
 * Returns a copied version of `value`.
 *
 * If `value` is primitive, returns `value`.
 * Otherwise, properties of `value` are copied recursively. Only `value`'s own
 * enumerable properties are cloned. Arrays are cloned by mapping over their
 * elements.
 *
 * If a path in `value` references itself or a parent path, then in the
 * resulting object that path will also reference the path it referenced in the
 * original object (but now in the resuling object instead of the original).
 */
const clone: <T>(value: T) => T = globalThis.structuredClone ?? cloneFallback;

export default clone;

function cloneFallback<T>(value: T): T {
  const map = new Map();
  const replacers: λ[] = [];
  const cloned = _clone(value, map, replacers, undefined as any);
  for (const f of replacers) f();
  return cloned;
}

function _clone(
  v: any,
  visited: Map<any, any>,
  replacers: λ[],
  replace: λ<[λ]>,
): any {
  if (typeof v !== "object" || v === null) return v;
  if (visited.has(v)) return replace(v);
  visited.set(v, 0);

  const cloneNext = (v: any, r: (v: any) => void) =>
    _clone(v, visited, replacers, (v: λ) => replacers.push(() => r(v)));

  const cloned: any = Array.isArray(v)
    ? v.map((e, i) => cloneNext(e, (v) => (cloned[i] = visited.get(v))))
    : Object.fromEntries(
      Object.entries(v).map(([k, e]) => [
        k,
        cloneNext(e, (v) => (cloned[k] = visited.get(v))),
      ]),
    );

  visited.set(v, cloned);
  return cloned;
}
