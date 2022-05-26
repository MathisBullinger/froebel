/**
 * Takes `n` elements from the iterable `list` and returns them as an array.
 *
 * @example
 * ```
 * take(5, repeat(1, 2))  // -> [1, 2, 1, 2, 1]
 * take(3, [1, 2, 3, 4])  // -> [1, 2, 3]
 * take(3, [1, 2])        // -> [1, 2]
 * ```
 */
export const takeList = <T>(n: number, list: Iterable<T>): T[] => [
  ...takeGenerator(n, list),
];

/**
 * Takes `n` elements from the iterable `list` and returns them as a generator.
 *
 * @example
 * ```
 * [...take(5, repeat(1, 2))]  // -> [1, 2, 1, 2, 1]
 * [...take(3, [1, 2, 3, 4])]  // -> [1, 2, 3]
 * [...take(3, [1, 2])]        // -> [1, 2]
 * ```
 */
export function* takeGenerator<T>(n: number, list: Iterable<T>): Generator<T> {
  let i = 0;
  for (const el of list) {
    if (i++ >= n) return;
    yield el;
  }
}
