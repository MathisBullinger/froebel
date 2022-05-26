/** Checks if `v` is one of `cmps`. */
const oneOf = <
  T,
  TT extends (T extends string ? string & T
    : T extends number ? number & T
    : any)[],
>(
  value: T,
  ...cmps: TT
): value is TT[number] => cmps.includes(value as any);

export default oneOf;
