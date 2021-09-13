import { UniqueViolationError } from './error'

class BiMapImpl<L, R, AL extends string = never, AR extends string = never> {
  constructor(
    data?: Map<L, R> | readonly (readonly [L, R])[],
    private aliasLeft?: AL,
    private aliasRight?: AR
  ) {
    const entries = data instanceof Map ? data.entries() : data ?? []
    const checkKeys = Array.isArray(data)

    const errDup = (side: string, k: any) => {
      throw new UniqueViolationError(
        `duplicate ${side} key ${JSON.stringify(k)}`
      )
    }
    for (const [k, v] of entries) {
      if (checkKeys && this.data.has(k)) errDup('left', k)
      if (iterHas(this.data.values(), v)) errDup('right', v)
      this.data.set(k, v)
    }

    if (aliasLeft !== undefined)
      Object.defineProperty(this, aliasLeft, { get: () => this.left })
    if (aliasRight !== undefined)
      Object.defineProperty(this, aliasRight, { get: () => this.right })
  }

  public static from<K extends string | symbol, V>(
    data: Record<K, V>
  ): BiMapImpl<K, V, never, never> {
    return new BiMapImpl(Object.entries(data) as [K, V][])
  }

  public reverse(): BiMapImpl<R, L, AR, AL> {
    return new BiMapImpl([...this.right], this.aliasRight, this.aliasLeft)
  }

  public clear() {
    this.data.clear()
    return this
  }

  public get size() {
    return this.data.size
  }

  public [Symbol.iterator]() {
    return this.data[Symbol.iterator]()
  }

  private proxy(ltr: boolean) {
    const map = {
      keys: this.data[ltr ? 'keys' : 'values'].bind(this.data),
      values: this.data[ltr ? 'values' : 'keys'].bind(this.data),
      has: ltr
        ? (k: L) => this.data.has(k)
        : (k: R) => iterHas(this.data.values(), k),
      [Symbol.iterator]: ltr
        ? () => this.data[Symbol.iterator]()
        : () => reverseIterator(this.data[Symbol.iterator]()),
      set: ltr
        ? (k: L, v: R) => {
            for (const entry of this.data) {
              if (entry[1] !== v) continue
              this.data.delete(entry[0])
              break
            }
            this.data.set(k, v)
            return v
          }
        : (k: R, v: L) => {
            this.data.set(v, k)
            return v
          },
      delete: ltr
        ? (k: L) => this.data.delete(k)
        : (k: R) => {
            for (const entry of this.data)
              if (entry[1] === k) return this.data.delete(entry[0])
            return false
          },
      clear: () => (this.clear(), ltr ? this.left : this.right),
    }

    return new Proxy(map, {
      get: (t: any, p) => {
        if (p in t) return t[p]
        if (p === 'size') return this.data.size
      },
      has: (t, p) => t.has(p),
      set: (t, p, v) => (t.set(p, v), true),
      deleteProperty: (t, p) => (t.delete(p), true),
    })
  }

  public readonly data = new Map<L, R>()
  public readonly left: Side<L, R> = this.proxy(true)
  public readonly right: Side<R, L> = this.proxy(false)
}

export default BiMapImpl as (new <
  L,
  R,
  AL extends string = never,
  AR extends string = never
>(
  data?: Map<L, R> | readonly (readonly [L, R])[],
  aliasLeft?: AL,
  aliasRight?: AR
) => BiMap<L, R, AL, AR>) &
  typeof BiMapImpl

export type BiMap<
  L,
  R,
  A extends string = never,
  B extends string = never
> = Omit<BiMapImpl<L, R, A, B>, 'reverse'> & {
  reverse(): BiMap<R, L, B, A>
} & { [K in A]: Side<L, R> } &
  { [K in B]: Side<R, L> }

type Side<K, V> = {
  keys(): IterableIterator<K>
  values(): IterableIterator<V>
  has(key: K): boolean
  get(key: K): V | undefined
  set<T extends V>(key: K, value: T): T
  delete(key: K): boolean
  clear(): Side<K, V>
  size: number
} & { [SK in Extract<K, string | symbol>]: V } &
  IterableIterator<[K, V]>

function reverseIterator<L, R>(
  iter: IterableIterator<[L, R]>
): IterableIterator<[R, L]> {
  return {
    next() {
      const { done, value } = iter.next()
      return { done, value: !value ? value : [value[1], value[0]] }
    },
    [Symbol.iterator]() {
      return this
    },
  }
}

function iterHas<T>(iter: IterableIterator<T>, value: T) {
  for (const entry of iter) if (entry === value) return true
  return false
}
