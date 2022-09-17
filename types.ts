export const assertType = <A, B>(
  ..._TYPE: IsEqualType<A, B, [], [A, B]>
) => {};

export const assertNotType = <A, B>(
  ..._TYPE: IsEqualType<A, B, [A], []>
) => {};

export type IsEqualType<A, B, True = true, False = false> =
  (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? True
    : False;

export type λ<TA extends any[] = any[], TR = any> = (...args: TA) => TR;
export type Fun = λ;

export type Primitive = string | number | boolean | symbol | null | undefined;

export type FilterKeys<T, F> = keyof {
  [K in keyof T as T[K] extends F ? K : never]: 0;
};

/** Any list of the `n`-first elements of `T`. */
export type PartialList<T extends any[]> = T extends [infer L, ...infer R]
  ? [] | [Widen<L>] | [Widen<L>, ...PartialList<R>]
  : [];

export type NarrowList<TStrict extends any[], TLoose extends any[]> = {
  [I in keyof TLoose]: I extends keyof TStrict
    ? TStrict[I] extends TLoose[I] ? TStrict[I]
    : TLoose[I]
    : TLoose[I];
};

export type Length<T extends any[]> = T extends { length: infer I } ? I : never;

export type TakeFirst<T extends any[], I extends number> = Length<T> extends I
  ? T
  : T extends [...infer S, any] ? TakeFirst<S, I>
  : never;

export type TakeLast<T extends any[], I extends number> = Length<T> extends I
  ? T
  : T extends [any, ...infer S] ? TakeLast<S, I>
  : never;

export type SplitAt<
  Front extends any[],
  I extends number,
  End extends any[] = [],
> = Length<Front> extends I ? [Front, End]
  : Front extends [...infer F_, infer L] ? SplitAt<F_, I, [L, ...End]>
  : never;

export type Slice<
  T extends any[],
  N extends number,
  D extends "front" | "back" = "front",
  S extends any[] = [],
> = Length<S> extends N ? T
  : T extends (
    D extends "front" ? [infer F, ...infer R] : [...infer R, infer F]
  ) ? Slice<R, N, D, [...S, F]>
  : T;

type Widen<T> = T extends string ? string : T extends number ? number : T;

/** If `T` is promise then the type it resolves to, otherwise `T`. */
export type PromType<T> = T extends PromiseLike<infer I> ? I : T;

export type MakeProm<T> = Promise<T extends PromiseLike<infer I> ? I : T>;

export type Async<T extends λ> = (
  ...args: Parameters<T>
) => MakeProm<ReturnType<T>>;

export type StringCase =
  | "camel"
  | "kebab"
  | "pascal"
  | "screaming-snake"
  | "snake";

export type Prefix<
  STR extends string,
  PRE extends string,
  CASE extends StringCase | void = void,
> = `${PRE}${CASE extends "snake" ? "_" : ""}${CASE extends "camel"
  ? Capitalize<STR>
  : STR}`;

export type Suffix<
  STR extends string,
  SUF extends string,
  CASE extends StringCase | void = void,
> = Prefix<SUF, STR, CASE>;

export type CamelCase<T extends string> = T extends `_${infer R}`
  ? `_${CamelCase<R>}`
  : T extends `-${infer R}` ? `-${CamelCase<R>}`
  : _Camel<Uncapitalize<T>>;

type _Camel<T extends string> = T extends `${infer A}${infer B}${infer C}`
  ? A extends "_" | "-" ? B extends "_" | "-" ? `${A}${_Camel<`${B}${C}`>}`
    : `${Uppercase<B>}${_Camel<C>}`
  : `${A}${_Camel<`${B}${C}`>}`
  : T;

export type PascalCase<T extends string> = Capitalize<CamelCase<T>>;

export type SnakeCase<T extends string> = DelimitedCase<T, "_">;

export type ScreamingSnakeCase<T extends string> = Uppercase<SnakeCase<T>>;

export type KebabCase<T extends string> = DelimitedCase<T, "-">;

type DelimitedCase<T extends string, D extends string> = T extends
  `${infer A}${infer B}${infer C}${infer R}`
  ? Lowercase<A> extends A
    ? A extends ("_" | "-")
      ? `${D}${Lowercase<B>}${DelimitedCase<`${C}${R}`, D>}`
    : Lowercase<B> extends B ? `${A}${DelimitedCase<`${B}${C}${R}`, D>}`
    : Lowercase<C> extends C
      ? `${A}${D}${Lowercase<B>}${C}${DelimitedCase<R, D>}`
    : `${A}${D}${InvertDelimited<`${B}${C}${R}`, D>}`
  : `${Lowercase<A>}${DelimitedCase<`${B}${C}${R}`, D>}`
  : T;

type InvertDelimited<T extends string, D extends string> = T extends
  `${infer A}${infer B}`
  ? Uppercase<A> extends A ? `${A}${InvertDelimited<B, D>}`
  : `${D}${DelimitedCase<`${A}${B}`, D>}`
  : T;

export type IsEvenLength<T extends string> = T extends
  `${string}${string}${infer S}` ? (S extends "" ? true : IsEvenLength<S>)
  : false;

export type Surround<T extends string, S extends string> = SplitEven<S> extends
  [infer A, infer B]
  ? `${A extends string ? A : never}${T}${B extends string ? B : never}`
  : never;

export type SplitString<T extends string, A extends string[] = []> = T extends
  `${infer H}${infer T}` ? SplitString<T, [...A, H]> : A;

export type SplitEven<T extends string> = EvenLength<SplitString<T>> extends
  [infer A, infer B] ? [
    Join<A extends unknown[] ? A : never, "">,
    Join<B extends unknown[] ? B : never, "">,
  ]
  : never;

type EvenLength<A extends unknown[], B extends unknown[] = []> = A extends []
  ? (B extends [] ? [B, A] : never)
  : (A extends { length: infer LA }
    ? (B extends { length: infer LB } ? (LA extends LB ? [B, A] : (
        A extends [infer H, ...infer T] ? EvenLength<T, [...B, H]> : never
      ))
      : never)
    : never);

export type IsUnion<T, U extends T = T> = T extends unknown
  ? [U] extends [T] ? false : true
  : false;

// logic types

export type NOT<T> = boolean extends T ? T : BitNot<T>;
export type BitNot<T> = T extends true ? false : true;

export type AND<A, B> = Switch<[
  [BitOr<LogicFalse<A>, LogicFalse<B>>, false],
  [BitOr<LogicNull<A>, LogicNull<B>>, boolean],
  true,
]>;
export type BitAnd<A, B> = A extends false ? false : B;

export type OR<A extends boolean, B extends boolean> = Switch<[
  [BitOr<LogicTrue<A>, LogicTrue<B>>, true],
  [BitOr<LogicNull<A>, LogicNull<B>>, boolean],
  false,
]>;
export type BitOr<A, B> = A extends true ? true : B;

export type XOR<A, B> = Switch<[
  [BitOr<LogicNull<A>, LogicNull<B>>, boolean],
  BitXor<A, B>,
]>;
export type BitXor<A, B> = A extends B ? false : true;

export type XNOR<A, B> = Switch<[
  [BitOr<LogicNull<A>, LogicNull<B>>, boolean],
  BitXnor<A, B>,
]>;
export type BitXnor<A, B> = A extends B ? true : false;

export type NOR<A, B> = Switch<[
  [BitAnd<LogicFalse<A>, LogicFalse<B>>, true],
  [BitOr<LogicTrue<A>, LogicTrue<B>>, false],
  boolean,
]>;
export type BitNor<A, B> = A extends true ? false : BitNot<B>;

export type NAND<A, B> = Switch<[
  [BitOr<LogicFalse<A>, LogicFalse<B>>, true],
  [BitOr<LogicNull<A>, LogicNull<B>>, boolean],
  false,
]>;
export type BitNand<A, B> = A extends false ? true : BitNot<B>;

export type LogicTrue<T> = boolean extends T ? false : T;

export type LogicFalse<T> = boolean extends T ? false : BitNot<T>;

export type LogicNull<T> = boolean extends T ? true
  : T extends boolean ? false
  : true;

/** Equivalent to `A extends B ? true : false` */
export type Extends<A, B> = IfElse<
  IsUnion<A>,
  [A] extends boolean ? true : false,
  A extends B ? true : false
>;

/** Returns `A` if `T` is `true`, `B` if `false`, and `A` | `B` otherwise. */
export type IfElse<T, A, B> = T extends true ? A : B;

type Switch<T extends any[]> = T extends [infer A, ...infer B] ? (
    A extends [boolean, any]
      ? (A[0] extends true ? A[1] : Switch<B extends any[] ? B : never>)
      : A
  )
  : never;

// Array.join types

export type Join<Array extends unknown[], Separator extends string> =
  Array extends [infer A, ...infer B] ? (B extends [] ? ToString<A>
      : `${ToString<A>}${Separator}${Join<B, Separator>}`)
    : "";

type JoinInnerArray<T extends unknown[]> = Join<T, ",">;

export type ToString<T> = T extends undefined | null | [] ? ""
  : T extends PositiveInfinity ? "Infinity"
  : T extends NegativeInfinity ? "-Infinity"
  : T extends string | number | boolean ? `${T}`
  : T extends Map<unknown, unknown> ? "[object Map]"
  : T extends Set<unknown> ? "[object Set]"
  : T extends Set<unknown> ? "[object Set]"
  : T extends unknown[] ? JoinInnerArray<T>
  : T extends WeakMap<any, unknown> ? "[object WeakMap]"
  : T extends WeakSet<any> ? "[object WeakSet]"
  : T extends
    | TypedArray
    | bigint
    | symbol
    | ((...args: unknown[]) => unknown)
    | RegExp
    | Error
    | Intl.NumberFormat
    | typeof globalThis ? string
  : T extends Promise<unknown> ? "[object Promise]"
  : T extends DataView ? "[object DataView]"
  : T extends SharedArrayBuffer ? "[object SharedArrayBuffer]"
  : T extends ArrayBuffer ? "[object ArrayBuffer]"
  : T extends Atomics ? "[object Atomics]"
  : T extends Intl.Collator ? "[object Intl.Collator]"
  : T extends Intl.DateTimeFormat ? "[object Intl.DateTimeFormat]"
  : T extends Intl.ListFormat ? "[object Intl.ListFormat]"
  : T extends Intl.NumberFormat ? "[object Intl.NumberFormat]"
  : T extends Intl.PluralRules ? "[object Intl.PluralRules]"
  : T extends Intl.RelativeTimeFormat ? "[object Intl.RelativeTimeFormat]"
  : T extends { toString(): infer R }
    ? (string extends R ? "[object Object]" : ReturnType<T["toString"]>)
  // deno-lint-ignore ban-types
  : T extends object ? "[object Object]"
  : never;

export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

export type PositiveInfinity = 1e999;
export type NegativeInfinity = -1e999;
