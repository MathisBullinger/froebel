import type { FilterKeys, λ } from "./types.ts";

class SortedArrayImpl<T> {
  #data: T[] = [];
  #cmp: Cmp<T>;

  constructor(compare: Cmp<T>, ...values: T[]) {
    this.#cmp = compare;
    if (values.length) this.#data = values.sort(compare);
    return wrap(this);
  }

  static from<T>(compare: Cmp<T>, source: Iterable<T>): SortedArrayImpl<T> {
    return new SortedArrayImpl(compare, ...source);
  }

  add(...values: T[]) {
    values.map(this.#addValue);
  }

  #addValue = ((value: T) => {
    for (let i = 0; i < this.#data.length; i++) {
      if (this.#cmp(value, this.#data[i]) >= 0) continue;
      this.#data.splice(i, 0, value);
      return;
    }
    this.#data.push(value);
  }).bind(this);

  delete = (...indices: number[]) =>
    indices
      .map((i) => (i >= 0 ? i : this.#data.length + i))
      .map((i, j, a) => {
        for (let k = j + 1; k < a.length; k++) if (a[k] > i) a[k]--;
        return this.#data.splice(i, 1)[0];
      });

  clear() {
    this.#data = [];
  }

  #ref<K extends FilterKeys<T[], λ>, I extends number>(
    method: K,
    i: I,
  ): SetArg<T[][K], 0, SetArg<FA<T[][K]>, I, SortedArray<T>>> {
    return ((f: λ, ...rest: any[]) =>
      (this.#data[method] as any)(
        (...args: any[]) => f(...args.slice(0, i), this, ...args.slice(i + 1)),
        ...rest,
      )) as any;
  }

  #bind = <K extends FilterKeys<T[], λ>>(method: K) =>
    ((...args: any[]) => (this.#data as any)[method](...args)) as T[][K];

  #wrap =
    <F extends λ<any, T[]>>(f: F) => (...args: Parameters<F>): SortedArray<T> =>
      new SortedArrayImpl(this.#cmp, ...f(...(args as any))) as any;

  every = this.#ref("every", 2);
  filter = this.#wrap(this.#ref("filter", 2));
  find = this.#ref("find", 2);
  findIndex = this.#ref("findIndex", 2);
  forEach = this.#ref("forEach", 2);
  includes = this.#bind("includes");
  indexOf = this.#bind("indexOf");
  join = this.#bind("join");
  lastIndexOf = this.#bind("lastIndexOf");
  map = this.#ref("map", 2);
  pop = this.#bind("pop");
  reduce = this.#ref("reduce", 3);
  reduceRight = this.#ref("reduceRight", 3);
  shift = this.#bind("shift");
  slice = this.#wrap(this.#bind("slice"));
  some = this.#ref("some", 2);

  at = (this.#data as any).at?.bind(this.#data) ??
    ((i: number) => this.#data[i >= 0 ? i : this.#data.length + i]);

  get length() {
    return this.#data.length;
  }

  public [Symbol.iterator]() {
    return this.#data[Symbol.iterator]();
  }
}

const wrap = <T>(v: T): T =>
  new Proxy(v as any, {
    get(t, k) {
      if (k in t || typeof k !== "string") {
        return typeof t[k] === "function" ? t[k].bind(t) : t[k];
      }
      for (const c of k) if (c < "0" || c > "9") return;
      return t.at(parseInt(k));
    },
    deleteProperty(t, k) {
      if (k in t || typeof k !== "string") return delete t[k];
      for (const c of k) if (c < "0" || c > "9") return true;
      t.delete(parseInt(k));
      return true;
    },
  });

/**
 * Sorted array. Behaves much like a regular array but its elements remain
 * sorted using the `compare` function supplied in the constructor.
 *
 * Contains most of the methods defined on regular JavaScript arrays as long as
 * they don't modify the array's content in place.
 *
 * New elements are added using the `add(...values)` method.
 *
 * Elements can still be accessed using bracket notation as in plain JavaScript
 * arrays but can't be assigned to using bracket notation (as that could change
 * the element's sort position).
 *
 * Elements can be removed using the `delete(...indices)` method, which returns
 * an array containing the deleted values.
 * Deleting an element using `delete sorted[index]` will also work, but results
 * in a TypeScript error because element access is marked readonly.
 *
 * Array methods that pass a reference of the array to a callback (e.g. `map`,
 * `reduce`, `find`) will pass a reference to the SortedArray instance instead.
 *
 * The `filter` and `slice` methods will return SortedArray instances instead of
 * plain arrays.
 */
export interface SortedArray<T> extends SortedArrayImpl<T> {
  readonly [K: number]: T;
}

export default SortedArrayImpl as unknown as
  & (new <T>(
    compare: Cmp<T>,
    ...value: T[]
  ) => SortedArray<T>)
  & { from: typeof SortedArrayImpl.from };

type Cmp<T> = (a: T, b: T) => number;

type SetI<T extends any[], I extends number, V> = Tup<
  {
    [K in keyof T]: K extends `${I}` ? V : T[K];
  }
>;

type Tup<T> = T extends any[] ? T : never;

type SetArg<T, I extends number, V> = T extends λ
  ? (...args: SetI<Parameters<T>, I, V>) => ReturnType<T>
  : never;

type FA<T> = T extends (..._: [infer F, ...any[]]) => any ? F : never;
