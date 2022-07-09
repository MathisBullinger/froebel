type Partition = {
  <T, S extends T>(list: T[], predicate: (el: T) => el is S): [
    S[],
    Exclude<T, S>[],
  ];
  <T extends readonly unknown[], S>(
    list: T,
    predicate: (el: any) => el is S,
  ): Part<T, S>;
  <T>(list: T[], predicate: (el: T) => unknown): [T[], T[]];
};

/**
 * Takes a `list` and returns a pair of lists containing: the elements that
 * match the `predicate` and those that don't, respectively.
 *
 * Think of it as `filter`, but the elements that don't pass the filter aren't
 * discarded but returned in a separate list instead.
 *
 * @example
 * ```
 * const [strings, numbers] = partition(
 *   ['a', 'b', 1, 'c', 2, 3],
 *   (el): el is string => typeof el === 'string'
 * )
 * // strings: ["a", "b", "c"]
 * // numbers: [1, 2, 3]
 * ```
 */
const partition: Partition = <T>(list: T[], predicate: (el: T) => unknown) =>
  list.reduce(
    ([t, f], c) => (predicate(c) ? [[...t, c], f] : [t, [...f, c]]) as any,
    [[], []],
  ) as any;

export default partition;

type Part<T extends readonly unknown[], S> = T extends readonly [
  infer F,
  ...infer R,
] ? [
    F extends S ? [F, ...Part<R, S>[0]] : Part<R, S>[0],
    F extends S ? Part<R, S>[1] : [F, ...Part<R, S>[1]],
  ]
  : [[], []];
