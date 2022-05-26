/**
 * Returns a generator that repeats `sequence`.
 *
 * @example
 * ```
 * // prints: 1, 2, 3, 1, 2, 3, ...
 * for (const n of repeat(1, 2, 3))
 *   console.log(n)
 * ```
 */
export default function* repeat<T>(...sequence: [T, ...T[]]): Generator<T> {
  while (true) for (const n of sequence) yield n;
}
