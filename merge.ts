import clone from "./clone.ts";
import {
  Mutable as Mutable_,
  OptionalKeys,
  Primitive,
  RequiredKeys,
} from "./types.ts";

const merge_ = (a: any, b: any): any => {
  const visited = new Map();
  return mergeItems(a, b, visited);
};

const mergeItems = (a: any, b: any, visited: Map<any, Map<any, any>>): any => {
  if (isPrimitive(a) || isPrimitive(b)) return clone(b);

  if (!visited.has(a)) visited.set(a, new Map());
  if (visited.get(a)!.has(b)) return visited.get(a)!.get(b);

  let result: any;

  if (Array.isArray(b)) {
    const clonedA = Array.isArray(a) ? clone(a) : [];
    const clonedB = clone(b);
    result = [...clonedA, ...clonedB];
    for (let i = 0; i < result.length; i++) {
      if (result[i] === clonedA || result[i] === clonedB) result[i] = result;
    }
  } else if (b instanceof Set) {
    result = new Set([...a instanceof Set ? a : [], ...b]);
    if (result.has(a) || result.has(b)) {
      result.delete(a);
      result.delete(b);
      result.add(result);
    }
  } else if (b instanceof Map) {
    result = new Map([...a instanceof Map ? a : [], ...b]);
    const keys = [...result.keys()];
    if (keys.includes(a)) {
      result.set(result, result.get(a));
      result.delete(a);
    }
    if (keys.includes(b)) {
      result.set(result, result.get(b));
      result.delete(b);
    }
    for (const [k, v] of result) {
      if (v === a || v === b) result.set(k, result);
    }
  } else {
    const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
    result = {};
    visited.get(a)!.set(b, result);

    for (const key of keys) {
      result[key] = !(key in b)
        ? clone(a[key])
        : !(key in a)
        ? clone(b[key])
        : mergeItems(a[key], b[key], visited);
    }
  }

  visited.get(a)!.set(b, result);
  return result;
};

/**
 * Recursively merges `A` and `B`. If a property in `A` and `B` is of a
 * different type (i.e. it's not an array, Set, Map, or plain object in both,
 * the value from `B` will be used in the result).
 *
 * If there are self-references in the cloned values, array / Set items, or Map
 * keys or values, they will also be self-referencing in the result.
 */
const merge = merge_ as <A, B>(a: A, b: B) => Merge<A, B>;
export default merge;

const isPrimitive = (value: unknown): value is Primitive =>
  typeof value !== "object" || value === null;

export type Merge<A, B> = A extends Primitive ? Mutable<B>
  : Merge_<Mutable<A>, Mutable<B>>;

type Merge_<A, B> =
  | Extract<B, Primitive>
  | MergeList<A, B>
  | MergeSet<A, B>
  | MergeMap<A, B>
  | MergeObject<A, B>;

type MergeSet<A, B> = B extends Set<infer IB> ? (
    A extends Set<infer IA> ? Set<IA | IB> : B
  )
  : never;

type MergeMap<A, B> = B extends Map<infer KB, infer VB> ? (
    A extends Map<infer KA, infer VA> ? Map<KA | KB, VA | VB> : B
  )
  : never;

type MergeObject<A, B> = B extends Record<any, unknown> ? (
    A extends Record<any, unknown> ? MergeObject_<A, B> : never
  )
  : never;

type MergeObject_<A, B> = MakeOptional<
  {
    [K in keyof A | keyof B]: K extends keyof B
      ? (K extends keyof A
        ? (Merge<A[K], B[K]> | (K extends OptionalKeys<B> ? A[K] : never))
        : B[K])
      : K extends keyof A ? A[K]
      : never;
  },
  | Exclude<OptionalKeys<B>, RequiredKeys<A>>
  | Exclude<OptionalKeys<A>, RequiredKeys<B>>
>;

type MergeList<A, B> = A extends unknown[] ? (B extends unknown[] ? (
      B[number][] extends Required<B> ? MergeArray<A, B>
        : A[number][] extends Required<A> ? MergeArray<A, B>
        : MergeTuple<A, B>
    )
    : never)
  : never;

type MergeTuple<A extends unknown[], B extends unknown[]> = B extends
  [infer H, ...infer T] ? MergeTuple<[...A, H], T>
  : A;

type MergeArray<A extends unknown[], B extends unknown[]> =
  (A[number] | B[number])[];

type MakeOptional<T, O extends keyof T> = FlattenIntersection<
  & Pick<T, Exclude<keyof T, O>>
  & { [K in O]?: T[K] }
>;

type FlattenIntersection<T> = { [K in keyof T]: T[K] };

type Mutable<T> = T extends Set<any> | Map<any, any> ? T : Mutable_<T>;
