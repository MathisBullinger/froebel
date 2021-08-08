export type λ<TA extends any[] = any[], TR = any> = (...args: TA) => TR
export type Fun = λ

export type Primitive = string | number | boolean | symbol | null | undefined

/** Any list of the `n`-first elements of `T`. */
export type PartialList<T extends any[]> = T extends [infer L, ...infer R]
  ? [] | [Widen<L>] | [Widen<L>, ...PartialList<R>]
  : []

export type NarrowList<TStrict extends any[], TLoose extends any[]> = {
  [I in keyof TLoose]: I extends keyof TStrict
    ? TStrict[I] extends TLoose[I]
      ? TStrict[I]
      : TLoose[I]
    : TLoose[I]
}

export type Length<T extends any[]> = T extends { length: infer I } ? I : never

export type TakeFirst<T extends any[], I extends number> = Length<T> extends I
  ? T
  : T extends [...infer S, any]
  ? TakeFirst<S, I>
  : never

export type TakeLast<T extends any[], I extends number> = Length<T> extends I
  ? T
  : T extends [any, ...infer S]
  ? TakeLast<S, I>
  : never

export type SplitAt<
  Front extends any[],
  I extends number,
  End extends any[] = []
> = Length<Front> extends I
  ? [Front, End]
  : Front extends [...infer F_, infer L]
  ? SplitAt<F_, I, [L, ...End]>
  : never

type Widen<T> = T extends string ? string : T extends number ? number : T

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
