import type { λ, FilterKeys } from './types'

/**
 * Behaves like a regular JavaScript `Map`, but its iteration order is dependant
 * on the `compare` function supplied in the constructor.
 *
 * Note: The item's sort position is only computed automatically on insertion.
 * If you update one of the values that the `compare` function depends on, you
 * must call the `update(key)` method afterwards to ensure the map stays sorted.
 */
export default class SortedMap<K, V> implements Map<K, V> {
  constructor(
    compare: Cmp<K, V>,
    entries?: readonly (readonly [K, V])[] | null
  ) {
    this.#cmp = compare
    if (!entries?.length) return
    const sorted = [...entries].sort(([ka, va], [kb, vb]) =>
      compare(va, vb, ka, kb)
    )
    for (let i = 0; i < entries.length; i++) {
      this.#map.set(...sorted[i])
      this.#order.push(i)
    }
  }

  #cmp: Cmp<K, V>
  #map = new Map<K, V>()
  #order: number[] = []

  #bind = <T extends FilterKeys<Map<K, V>, λ>>(method: T) =>
    this.#map[method].bind(this.#map) as Map<K, V>[T]

  clear = this.#bind('clear')
  get = this.#bind('get')
  has = this.#bind('has')

  set(key: K, value: V): this {
    if (this.#map.has(key)) this.delete(key)
    let i = 0
    for (const [k, v] of this) {
      if (this.#cmp(value, v, key, k) < 0) break
      i++
    }
    this.#order.splice(i, 0, this.size)
    this.#map.set(key, value)
    return this
  }

  delete(key: K) {
    if (this.#map.has(key)) {
      const i = [...this.#map.keys()].indexOf(key)
      this.#order.splice(this.#order.indexOf(i), 1)
      this.#order = this.#order.map(n => (n < i ? n : n - 1))
    }
    return this.#map.delete(key)
  }

  /**
   * Update the sort position of the element at `key` if necessary.
   *
   * This method should be called to notify the SortedMap that one of the
   * parameters that the `compare` function depends on has been updated and
   * consequently the sort order must be verified/updated.
   *
   * @returns `true` if the sort position of the element with `key` had to be
   * updated, `false` if not.
   */
  update(key: K) {
    const entries = [...this.#map.entries()]
    const i = entries.findIndex(([k]) => k === key)
    const oi = this.#order.indexOf(i)
    const e = entries[i]
    const l = entries[this.#order[oi - 1]]
    const r = entries[this.#order[oi + 1]]

    if (
      (!l || this.#cmp(l[1], e[1], l[0], e[0]) <= 0) &&
      (!r || this.#cmp(e[1], r[1], e[0], r[0]) <= 0)
    )
      return false

    this.set(...e)
    return true
  }

  forEach(callback: (value: V, key: K, map: SortedMap<K, V>) => void) {
    for (const [k, v] of this.entries()) callback(v, k, this)
  }

  map<T>(callback: (value: V, key: K, map: SortedMap<K, V>) => T): T[] {
    return [...this].map(([k, v]) => callback(v, k, this))
  }

  get size() {
    return this.#map.size
  }

  #orderIter<T>(iter: Iterable<T>): IterableIterator<T> {
    const items = [...iter]
    let i = -1
    return {
      next: () => {
        i++
        return {
          done: i >= items.length,
          value: items[this.#order[i]],
        }
      },
      [Symbol.iterator]() {
        return this
      },
    }
  }

  public [Symbol.iterator] = () => this.#orderIter(this.#map)
  entries = () => this.#orderIter(this.#map.entries())
  keys = () => this.#orderIter(this.#map.keys())
  values = () => this.#orderIter(this.#map.values())

  public [Symbol.toStringTag] = this.#map[Symbol.toStringTag]
}

type Cmp<K, V> = (valueA: V, valueB: V, keyA: K, keyB: K) => number
