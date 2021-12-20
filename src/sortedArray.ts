import type { λ } from './types'

class SortedArrayImpl<T> {
  #data: T[] = []
  #cmp: Cmp<T>

  constructor(compare: Cmp<T>, ...values: T[]) {
    this.#cmp = compare
    if (values.length) this.#data = values.sort(compare)
    return wrap(this)
  }

  static from<T>(compare: Cmp<T>, source: Iterable<T>): SortedArrayImpl<T> {
    return new SortedArrayImpl(compare, ...source)
  }

  add(...values: T[]) {
    values.map(this.#addValue)
  }

  #addValue = ((value: T) => {
    for (let i = 0; i < this.#data.length; i++) {
      if (this.#cmp(value, this.#data[i]) >= 0) continue
      this.#data.splice(i, 0, value)
      return
    }
    this.#data.push(value)
  }).bind(this)

  delete = (...indices: number[]) =>
    indices
      .map(i => (i >= 0 ? i : this.#data.length + i))
      .map((i, j, a) => {
        for (let k = j + 1; k < a.length; k++) if (a[k] > i) a[k]--
        return this.#data.splice(i, 1)[0]
      })

  clear() {
    this.#data = []
  }

  #ref<K extends Met<T>, I extends number>(
    method: K,
    i: I
  ): SetArg<T[][K], 0, SetArg<FA<T[][K]>, I, SortedArray<T>>> {
    return ((f: λ, ...rest: any[]) =>
      (this.#data[method] as any)(
        (...args: any[]) => f(...args.slice(0, i), this, ...args.slice(i + 1)),
        ...rest
      )) as any
  }

  #bind = <K extends Met<T>>(method: K) =>
    ((...args: any[]) => (this.#data as any)[method](...args)) as T[][K]

  #wrap =
    <F extends λ<any, T[]>>(f: F) =>
    (...args: Parameters<F>): SortedArray<T> =>
      new SortedArrayImpl(this.#cmp, ...f(...(args as any))) as any

  every = this.#ref('every', 2)
  filter = this.#wrap(this.#ref('filter', 2))
  find = this.#ref('find', 2)
  findIndex = this.#ref('findIndex', 2)
  forEach = this.#ref('forEach', 2)
  includes = this.#bind('includes')
  indexOf = this.#bind('indexOf')
  join = this.#bind('join')
  lastIndexOf = this.#bind('lastIndexOf')
  map = this.#ref('map', 2)
  pop = this.#bind('pop')
  reduce = this.#ref('reduce', 3)
  reduceRight = this.#ref('reduceRight', 3)
  shift = this.#bind('shift')
  slice = this.#wrap(this.#bind('slice'))
  some = this.#ref('some', 2)

  public [Symbol.iterator]() {
    return this.#data[Symbol.iterator]()
  }

  at =
    (this.#data as any).at?.bind(this.#data) ??
    ((i: number) => this.#data[i >= 0 ? i : this.#data.length + i])

  get length() {
    return this.#data.length
  }
}

const wrap = <T>(v: T): T =>
  new Proxy(v as any, {
    get(t, k) {
      if (k in t || typeof k !== 'string')
        return typeof t[k] === 'function' ? t[k].bind(t) : t[k]
      for (const c of k) if (c < '0' || c > '9') return
      return t.at(parseInt(k))
    },
    deleteProperty(t, k) {
      if (k in t || typeof k !== 'string') return delete t[k]
      for (const c of k) if (c < '0' || c > '9') return true
      t.delete(parseInt(k))
      return true
    },
  })

export interface SortedArray<T> extends SortedArrayImpl<T> {
  readonly [K: number]: T
}

export default SortedArrayImpl as unknown as (new <T>(
  compare: Cmp<T>,
  ...value: T[]
) => SortedArray<T>) & { from: typeof SortedArrayImpl.from }

type Cmp<T> = (a: T, b: T) => number

type Met<T> = keyof { [K in keyof T[] as T[][K] extends λ ? K : never]: 0 }

type SetI<T extends any[], I extends number, V> = Tup<{
  [K in keyof T]: K extends `${I}` ? V : T[K]
}>

type Tup<T> = T extends any[] ? T : never

type SetArg<T, I extends number, V> = T extends λ
  ? (...args: SetI<Parameters<T>, I, V>) => ReturnType<T>
  : never

type FA<T> = T extends (..._: [infer F, ...any[]]) => any ? F : never
