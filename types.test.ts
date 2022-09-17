import { assertType } from "./types.ts";
import type {
  CamelCase,
  IsEvenLength,
  Join,
  KebabCase,
  NarrowList,
  PascalCase,
  ScreamingSnakeCase,
  SnakeCase,
  SplitAt,
  SplitEven,
  SplitString,
  Surround,
  TakeFirst,
  TakeLast,
  ToString,
} from "./types.ts";

Deno.test("static type tests", () => {
  {
    const symA = Symbol("a");
    const symB = Symbol("b");
    type SymA = typeof symA;
    type SymB = typeof symB;

    assertType<number, number>();
    assertType<any, any>();
    assertType<unknown, unknown>();
    assertType<[string], [string]>();
    assertType<never, never>();
    assertType<SymA, SymA>();
    assertType<1, 1>();

    // @ts-expect-error
    assertType<number, any>();
    // @ts-expect-error
    assertType<any, number>();
    // @ts-expect-error
    assertType<unknown, any>();
    // @ts-expect-error
    assertType<unknown, string>();
    // @ts-expect-error
    assertType<string, unknown>();
    // @ts-expect-error
    assertType<string[], [string]>();
    // @ts-expect-error
    assertType<[string, number], [string, number?]>();
    // @ts-expect-error
    assertType<number, never>();
    // @ts-expect-error
    assertType<never, number>();
    // @ts-expect-error
    assertType<any, never>();
    // @ts-expect-error
    assertType<SymA, SymB>();
    // @ts-expect-error
    assertType<"foo", string>();
    // @ts-expect-error
    assertType<number, 1>();
    // @ts-expect-error
    assertType<2, 3>();
  }

  {
    type Full = [string, number, boolean, null];

    assertType<[], TakeFirst<Full, 0>>();
    assertType<[string], TakeFirst<Full, 1>>();
    assertType<[string, number], TakeFirst<Full, 2>>();
    assertType<[string, number, boolean], TakeFirst<Full, 3>>();
    assertType<[string, number, boolean, null], TakeFirst<Full, 4>>();
    assertType<never, TakeFirst<Full, 5>>();
  }

  {
    type Full = [string, number, boolean, null];

    assertType<TakeLast<Full, 0>, []>();
    assertType<TakeLast<Full, 1>, [null]>();
    assertType<TakeLast<Full, 2>, [boolean, null]>();
    assertType<TakeLast<Full, 3>, [number, boolean, null]>();
    assertType<TakeLast<Full, 4>, [string, number, boolean, null]>();
    assertType<TakeLast<Full, 5>, never>();
  }

  {
    type Full = [string, number, boolean, null];

    assertType<SplitAt<Full, 4>, [[string, number, boolean, null], []]>();
    assertType<SplitAt<Full, 3>, [[string, number, boolean], [null]]>();
    assertType<SplitAt<Full, 2>, [[string, number], [boolean, null]]>();
    assertType<SplitAt<Full, 1>, [[string], [number, boolean, null]]>();
    assertType<SplitAt<Full, 0>, [[], [string, number, boolean, null]]>();
  }

  {
    type Strict = ["A" | "B", 1 | 2 | 3, number];

    assertType<
      NarrowList<Strict, [string, number, 5]>,
      ["A" | "B", 1 | 2 | 3, 5]
    >();
  }

  {
    assertType<CamelCase<"foo_bar">, "fooBar">();
    assertType<CamelCase<"foo-bar">, "fooBar">();
    assertType<CamelCase<"__foo_bar__baz__">, "__fooBar_Baz__">();
    assertType<CamelCase<"-_foo_bar-_baz_-">, "-_fooBar-Baz_-">();
    assertType<CamelCase<"FooBar">, "fooBar">();
  }

  {
    assertType<PascalCase<"foo_bar">, "FooBar">();
  }

  {
    assertType<SnakeCase<"fooBar">, "foo_bar">();
    assertType<SnakeCase<"FooBar">, "foo_bar">();
    assertType<SnakeCase<"fooBarABC0D">, "foo_bar_ABC0D">();
    assertType<SnakeCase<"fooBarABC0DfooBar">, "foo_bar_ABC0D_foo_bar">();
    assertType<SnakeCase<"foo_bar">, "foo_bar">();
    assertType<SnakeCase<"foo_Bar">, "foo_bar">();
    // @ts-expect-error
    assertType<SnakeCase<"fooBar">, "">();
    assertType<SnakeCase<"foo-bar">, "foo_bar">();
    assertType<SnakeCase<"foo-Bar">, "foo_bar">();
  }

  {
    assertType<ScreamingSnakeCase<"fooBar">, "FOO_BAR">();
  }

  {
    assertType<KebabCase<"fooBar">, "foo-bar">();
    assertType<KebabCase<"FooBar">, "foo-bar">();
    assertType<KebabCase<"fooBarABC0D">, "foo-bar-ABC0D">();
    assertType<KebabCase<"fooBarABC0DfooBar">, "foo-bar-ABC0D-foo-bar">();
    assertType<KebabCase<"foo_bar">, "foo-bar">();
    assertType<KebabCase<"foo_Bar">, "foo-bar">();
    // @ts-expect-error
    assertType<KebabCase<"fooBar">, "">();
    assertType<KebabCase<"foo-bar">, "foo-bar">();
    assertType<KebabCase<"foo-Bar">, "foo-bar">();
  }

  {
    assertType<IsEvenLength<"">, false>();
    assertType<IsEvenLength<"a">, false>();
    assertType<IsEvenLength<"ab">, true>();
    assertType<IsEvenLength<"abc">, false>();
    assertType<IsEvenLength<"abcd">, true>();
    assertType<IsEvenLength<"abcde">, false>();
  }

  {
    assertType<SplitString<"foobar">, ["f", "o", "o", "b", "a", "r"]>();
  }

  {
    type List1 = [
      undefined,
      "a",
      1,
      [2, [4, undefined, Record<never, never>, [5, 6]], 7],
      "b",
      null,
      Record<never, never>,
      [],
      8,
    ];

    assertType<
      Join<List1, "">,
      "a12,4,,[object Object],5,6,7b[object Object]8"
    >();

    assertType<
      Join<List1, " | ">,
      " | a | 1 | 2,4,,[object Object],5,6,7 | b |  | [object Object] |  | 8"
    >();

    assertType<Join<[123], "">, "123">();
    assertType<Join<[], ", ">, "">();

    type List2 = [Map<any, any>, Set<any>, Uint16Array, DataView];

    assertType<
      Join<List2, " ">,
      `[object Map] [object Set] ${string} [object DataView]`
    >();
  }

  {
    assertType<ToString<"foo">, "foo">();
    assertType<ToString<123>, "123">();
    assertType<ToString<true>, "true">();
    assertType<ToString<false>, "false">();
    assertType<ToString<Record<never, never>>, "[object Object]">();
    assertType<ToString<{ foo: 123 }>, "[object Object]">();
    assertType<ToString<[]>, "">();
    assertType<ToString<[1, 2, 3]>, "1,2,3">();
    assertType<ToString<[1, [2, [3, 4], 5]]>, "1,2,3,4,5">();
    assertType<ToString<WeakMap<any, any>>, "[object WeakMap]">();
    assertType<ToString<Int8Array>, string>();
    assertType<ToString<Float64Array>, string>();
    assertType<ToString<bigint>, string>();
    assertType<ToString<symbol>, string>();
    assertType<ToString<typeof globalThis>, string>();
    assertType<ToString<ArrayBuffer>, "[object ArrayBuffer]">();
    assertType<ToString<SharedArrayBuffer>, "[object SharedArrayBuffer]">();
    assertType<ToString<DataView>, "[object DataView]">();
    assertType<ToString<Promise<any>>, "[object Promise]">();
    assertType<ToString<() => 2>, string>();
    assertType<ToString<GeneratorFunction>, string>();
    assertType<ToString<Atomics>, "[object Atomics]">();
    assertType<ToString<Intl.Collator>, "[object Intl.Collator]">();
    assertType<ToString<Intl.NumberFormat>, string>();
    assertType<ToString<{ toString(): "foo" }>, "foo">();
  }

  {
    assertType<SplitEven<"ab">, ["a", "b"]>();
    assertType<SplitEven<"abcd">, ["ab", "cd"]>();
    assertType<SplitEven<"abcdef">, ["abc", "def"]>();
  }

  {
    assertType<Surround<"foo", "()">, "(foo)">();
    assertType<Surround<"foo", "([])">, "([foo])">();
    assertType<Surround<"foo", "([{}])">, "([{foo}])">();
  }
});
