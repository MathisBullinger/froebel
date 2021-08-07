export type λ<TA extends any[] = any[], TR = any> = (...args: TA) => TR
export type Fun = λ

export type Primitive = string | number | boolean | symbol | null | undefined

/** Any list of the `n`-first elements of `T`. */
export type PartialList<T extends any[]> = T extends [infer L, ...infer R]
  ? [] | [L] | [L, ...PartialList<R>]
  : []

/** If `T` is promise then the type it resolves to, otherwise `T`. */
export type PromType<T> = T extends PromiseLike<infer I> ? I : T

export type StringCase = 'camel' | 'snake'

export type Prefix<
  STR extends string,
  PRE extends string,
  CASE extends StringCase | void = void
> = `${PRE}${CASE extends 'snake' ? '_' : ''}${CASE extends 'camel'
  ? Capitalize<STR>
  : STR}`

export type Suffix<
  STR extends string,
  SUF extends string,
  CASE extends StringCase | void = void
> = Prefix<SUF, STR, CASE>
