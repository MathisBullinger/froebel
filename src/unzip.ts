import type { λ } from "./types.ts";

type Unzip<T extends unknown[]> = { [I in keyof T]: T[I][] };

/**
 * Reverse of {@link zip}. Takes a list of tuples and deconstructs them into
 * an array (of length of the tuples length) of lists each containing all the
 * elements in all tuples at the lists index.
 *
 * @example
 * const [nums, chars] = unzip([1,'a'], [2,'b'], [3,'c'])
 * console.log(nums)  // prints: [1, 2, 3]
 * console.log(chars) // prints: ['a','b','c']
 */
const unzip = <T extends unknown[]>(...zipped: [...T][]): Unzip<T> =>
  zipped.reduce((a, c) => c.map((v, i) => [...(a[i] ?? []), v]), [] as any);

export default unzip;

/**
 * Same as {@link unzip} but accepts an `unzipper` function for each tuple
 * index. The `unzipper`'s return value is used as the value in the list at
 * that index returned from `unzipWith`.
 *
 * The `unzipper` takes the current element as its first argument, an
 * accumulator as second argument (initially `undefined`) and its return value
 * is the accumulator passed into the next invocation.
 *
 * @example
 * const [nums, str] = unzip(
 *   [ [1,'a'], [2,'b'], [3,'c'] ],
 *   (n, acc: number[] = []) => [...acc, n],
 *   (c, str = '') => str + c
 * )
 *
 * console.log(nums) // prints: [1, 2, 3]
 * console.log(str)  // prints: 'abc'
 */
export const unzipWith = <
  T extends unknown[],
  U extends {
    [I in keyof T]: λ<[cur: T[I], acc: any]>;
  },
>(
  zipped: [...T][],
  ...unzippers: U
): { [I in keyof U]: ReturnType<U[I]> } =>
  zipped.reduce((a, c) => c.map((v, i) => unzippers[i](v, a[i])), [] as any);
