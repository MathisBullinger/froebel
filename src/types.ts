export type λ<TA extends any[] = any[], TR = any> = (...args: TA) => TR
export type Fun = λ

export type PartialList<T extends any[]> = T extends [infer L, ...infer R]
  ? [] | [L] | [L, ...PartialList<R>]
  : []
