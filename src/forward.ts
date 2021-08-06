const forward =
  <T extends λ, PR extends any[]>(fun: T, ...argsR: PR) =>
  (
    ...argsL: Parameters<T> extends [...infer PL, ...PR] ? PL : never
  ): ReturnType<T> =>
    fun(...argsL, ...argsR)

export default forward
