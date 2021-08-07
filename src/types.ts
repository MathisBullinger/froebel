export type λ<TA extends any[] = any[], TR = any> = (...args: TA) => TR
export type Fun = λ

export type Primitive = string | number | boolean | symbol | null | undefined

/** Any list of the `n`-first elements of `T`. */
export type PartialList<T extends any[]> = T extends [infer L, ...infer R]
  ? [] | [L] | [L, ...PartialList<R>]
  : []

/** If `T` is promise then the type it resolves to, otherwise `T`. */
export type PromType<T> = T extends PromiseLike<infer I> ? I : T
