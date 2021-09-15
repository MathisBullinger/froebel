import { UniqueViolationError } from './error'
import zip from './zip'

type AliasConstr<AL extends string, AR extends string> = {
  <L, R>(data?: Map<L, R>): BiMap<L, R, AL, AR>
  <T extends readonly (readonly [unknown, unknown])[]>(data: T): BiMap<
    T[number] extends [infer L, any] ? L : never,
    T[number] extends [any, infer R] ? R : never,
    AL,
    AR
  >
  <L, R>(left: Set<L>, right: Set<R>): BiMap<L, R, AL, AR>
  <T extends Record<L, R>, L extends string | symbol, R>(
    data: T
  ): T extends Set<any> ? never : BiMap<L, R, AL, AR>
}

class BiMapImpl<L, R, AL extends string = never, AR extends string = never> {
  private aliasLeft?: string
  private aliasRight?: string

  constructor(
    data?: Map<L, R> | readonly (readonly [L, R])[],
    aliasLeft?: AL,
    aliasRight?: AR
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

    this.defineAlias(aliasLeft, aliasRight)
  }

  public static from: AliasConstr<never, never> = (...args: any[]) =>
    new BiMapImpl(
      !args[0] || args[0] instanceof Map || Array.isArray(args[0])
        ? args[0]
        : args[0] instanceof Set
        ? BiMapImpl.fromSets(...(args as [any, any]))
        : Object.entries(args[0])
    )

  private static fromSets<KL, KR>(
    left: Set<KL>,
    right: Set<KR>
  ): BiMapImpl<KL, KR> {
    if (!left || !right || left.size !== right.size)
      throw new TypeError(
        'must have same number of keys on left and right side'
      )
    return new BiMapImpl(zip([...left.keys()], [...right.keys()]))
  }

  public static alias =
    <LA extends string, RA extends string>(
      left: LA,
      right: RA
    ): AliasConstr<LA, RA> =>
    (...args: any[]) => {
      const map: any = BiMapImpl.from(...args)
      map.defineAlias(left, right)
      return map
    }

  private defineAlias(left?: string, right?: string) {
    if (left !== undefined) {
      this.aliasLeft = left
      Object.defineProperty(this, left, { get: () => this.left })
    }
    if (right !== undefined) {
      this.aliasRight = right
      Object.defineProperty(this, right, { get: () => this.right })
    }
  }

  public clone(): BiMapImpl<L, R, AL, AR> {
    return new BiMapImpl([...this.left], this.aliasLeft, this.aliasRight)
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
      get: ltr
        ? (k: L) => this.data.get(k)
        : (k: R) => {
            for (const entry of this.data.entries())
              if (entry[1] === k) return entry[0]
          },
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
      getOrSet: ltr
        ? (k: L, v: R) =>
            this.data.has(k) ? this.data.get(k) : (this.data.set(k, v), v)
        : (k: R, v: L) => {
            for (const entry of this.data.entries())
              if (entry[1] === k) return entry[0]
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
        return t.get(p)
      },
      has: (t, p) => t.has(p),
      set: (t, p, v) => (t.set(p, v), true),
      deleteProperty: (t, p) => (t.delete(p), true),
    })
  }

  private readonly data = new Map<L, R>()
  public readonly left: MapLike<L, R> = this.proxy(true)
  public readonly right: MapLike<R, L> = this.proxy(false)
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

/**
 * Bidirectional map. Maps two sets of keys in a one-to-one relation.
 *
 * Both sides are accessible (at .left & .right, or at their respective alias if
 * one was provided in the constructor) with an interface similar to that of the
 * built-in Map and the same iteration behavior.
 *
 * @example
 * ```
 * const nums = BiMap.from({ one: 1, two: 2 })
 *
 * // different ways of iterating over the entries
 * [...nums.left]                 // [['one',1], ['two',2]]
 * [...nums.right]                // [[1,'one'], [2,'two']]
 * [...nums.left.keys()]          // ['one', 'two']
 * [...nums.left.values()]        // [1, 2]
 * [...nums.right.keys()]         // [1, 2]
 * [...nums.right.values()]       // ['one', 'two']
 * [...nums]                      // [['one',1], ['two',2]]
 * [...nums.right.entries()]      // [[1,'one'], [2,'two']]
 * Object.fromEntries(nums.right) // { '1': 'one', '2': 'two' }
 *
 * // setting a value
 * nums.left.three = 3
 * // when accessing a property using bracket notation (i.e. nums.right[4]),
 * // JavaScript coerces the key to a string, so keys that aren't strings or
 * // symbols must be accessed using the same access methods known from Map.
 * nums.right.set(4, 'four')
 *
 * // remapping values
 * nums.left.tres = 3          // {one: 1, two: 2, tres: 3, four: 4}
 * nums.right.set(4, 'cuatro') // {one: 1, two: 2, tres: 3, cuatro: 4}
 *
 * // deleting
 * delete nums.left.tres    // {one: 1, two: 2, cuatro: 4}
 * nums.right.delete(4)     // {one: 1, two: 2}
 *
 * // reversing the map
 * const num2Name = nums.reverse()
 * console.log([...num2Name.left])                 // [[1,'one'], [2,'two']]
 * console.log(Object.fromEntries(num2Name.right)) // {one: 1, two: 2}
 *
 * // other methods known from built-in Map
 * nums.size               // 2
 * nums.[left|right].size  // 2
 * nums.clear() // equivalent to nums.[left|right].clear()
 * console.log(nums.size)  // 0
 * ```
 *
 * @example
 * ```
 * // giving aliases to both sides
 * const dictionary = new BiMap(
 *   [
 *     ['hello', 'hallo'],
 *     ['bye', 'tschüss'],
 *   ],
 *   'en',
 *   'de'
 * )
 *
 * dictionary.de.get('hallo') // 'hello'
 * dictionary.en.get('bye')   // 'tschüss'
 *
 * delete dictionary.de.hallo
 * console.log(Object.fromEntries(dictionary.en)) // { bye: 'tschüss' }
 *
 * // you can also use the BiMap.alias method:
 * BiMap.alias('en', 'de')<string, string>()
 * BiMap.alias('en', 'de')([['hello', 'hallo']])
 * BiMap.alias('en', 'de')(new Map<string, string>())
 * BiMap.alias('en', 'de')({ hello: 'hallo' })
 * BiMap.alias('en', 'de')(new Set(['hello']), new Set(['hallo']))
 *
 * // the same arguments can be used with BiMap.from, e.g.:
 * BiMap.from(new Set<number>(), new Set<number>())
 * ```
 */
export type BiMap<
  L,
  R,
  A extends string = never,
  B extends string = never
> = Omit<BiMapImpl<L, R, A, B>, 'clone' | 'reverse'> & {
  clone(): BiMap<L, R, A, B>
  reverse(): BiMap<R, L, B, A>
} & { [K in A]: MapLike<L, R> } &
  { [K in B]: MapLike<R, L> }

type MapLike<K, V> = {
  keys(): IterableIterator<K>
  values(): IterableIterator<V>
  has(key: K): boolean
  get(key: K): V | undefined
  set<T extends V>(key: K, value: T): T
  getOrSet(key: K, value: V): V
  delete(key: K): boolean
  clear(): MapLike<K, V>
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
