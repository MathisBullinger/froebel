const partial =
  <T extends λ, PL extends PartialList<Parameters<T>>>(fun: T, ...argsL: PL) =>
  (
    ...argsR: Parameters<T> extends [...PL, ...infer PR] ? PR : never
  ): ReturnType<T> =>
    fun(...argsL, ...argsR)

export default partial
