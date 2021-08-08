export type Zip<T extends unknown[][]> = {
  [I in keyof T]: T[I] extends (infer U)[] ? U : never
}[]

/**
 * Takes multiple lists and returns a list of tuples containing the value in
 * each list at the current index. If the lists are of different lengths, the
 * returned list of tuples has the length of the shortest passed in list.
 *
 * @example
 * ```
 * const pairs = zip([1,2,3], ['a','b','c'])
 * console.log(pairs) // prints: [[1,'a'], [2,'b'], [3,'c']]
 * ```
 */
const zip = <T extends unknown[][]>(...lists: T): Zip<T> =>
  [...Array(Math.min(...lists.map(({ length }) => length)))].map((_, i) =>
    lists.map(l => l[i])
  ) as any

export default zip

/**
 * Same as {@link zip} but also takes a `zipper` function, that is called for
 * each index with the element at current index in each list as arguments. The
 * result of `zipper` is the element at current index in the list returned from
 * `zipWith`.
 *
 * @example
 * ```
 * const sums = zipWith((a,b) => a+b, [1,2,3], [4,5,6])
 * console.log(sums) // prints: [5,7,9]
 * ```
 */
export const zipWith = <T extends unknown[][], U>(
  zipper: (...args: Zip<T>[0]) => U,
  ...lists: T
): U[] =>
  [...Array(Math.min(...lists.map(({ length }) => length)))].map((_, i) =>
    zipper(...(lists.map(l => l[i]) as any))
  )
