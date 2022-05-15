import type { AppendArray, SizedArray, SizeOf } from "./types.ts";

/** Adds `A` to `B`. */
export type Add<A extends number, B extends number> = SizeOf<
  AppendArray<SizedArray<A>, SizedArray<B>>
>;

/** Subtracts `B` from `A`. */
export type Subtract<A extends number, B extends number> = SubtractHelper<
  SizedArray<A>,
  SizedArray<B>
>;

/** Multiplies `A` and `B` */
export type Multiply<A extends number, B extends number> = A extends 0 ? 0
  : B extends 0 ? 0
  : MultiplyHelper<A, B>;

export type Greater<A extends number, B extends number> = A extends B ? false
  : SizedArray<A> extends [...SizedArray<B>, ...unknown[]] ? true
  : false;

export type Smaller<A extends number, B extends number> = Greater<B, A>;

type MultiplyHelper<
  A extends number,
  B extends number,
  P extends unknown[] = SizedArray<A>,
> = B extends 1 ? SizeOf<P>
  : MultiplyHelper<A, Subtract<B, 1>, AppendArray<P, SizedArray<A>>>;

type SubtractHelper<A extends unknown[], B extends unknown[]> = B extends [
  infer H,
  ...infer T,
] ? SubtractHelper<A extends [infer _, ...infer AT] ? AT : never, T>
  : SizeOf<A>;
