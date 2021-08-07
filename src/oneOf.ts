/** Checks if `v` is one of `cmps`. */
const oneOf = <T extends any[]>(v: unknown, ...cmps: T): v is T[number] =>
  cmps.includes(v)

export default oneOf
