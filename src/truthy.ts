/** Checks if `value` is truthy. Literal types are narrowed accordingly. */
export const truthy = <T>(value: T): value is PickTruthy<T> => !!value;

/** Checks if `value` is falsy. Literal types are narrowed accordingly. */
export const falsy = <T>(value: T): value is PickFalsy<T> => !value;

type PickTruthy<T> =
  | (true extends T ? true : never)
  | (T extends string ? Exclude<T, ""> : never)
  | (T extends number ? Exclude<T, 0> : never)
  | Exclude<T, undefined | null | string | number | boolean>;

type PickFalsy<T> =
  | (null extends T ? null : never)
  | (undefined extends T ? undefined : never)
  | (false extends T ? false : never)
  | (0 extends T ? 0 : never)
  | ("" extends T ? "" : never);
