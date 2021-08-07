export type Zip<T extends unknown[][]> = {
  [I in keyof T]: T[I] extends (infer U)[] ? U : never
}[]

const zip = <T extends unknown[][]>(...lists: T): Zip<T> =>
  [...Array(Math.min(...lists.map(({ length }) => length)))].map((_, i) =>
    lists.map(l => l[i])
  ) as any

export default zip

export const zipWith = <T extends unknown[][], U>(
  zipper: (...args: Zip<T>[0]) => U,
  ...lists: T
): U[] =>
  [...Array(Math.min(...lists.map(({ length }) => length)))].map((_, i) =>
    zipper(...(lists.map(l => l[i]) as any))
  )
