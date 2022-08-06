import type {
  CamelCase,
  IsEvenLength,
  Join,
  KebabCase,
  NarrowList,
  PascalCase,
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
  type Expected<T, U extends T> = 0;

  {
    type Full = [string, number, boolean, null];

    type _0 = Expected<[], TakeFirst<Full, 0>>;
    type _1 = Expected<[string], TakeFirst<Full, 1>>;
    type _2 = Expected<[string, number], TakeFirst<Full, 2>>;
    type _3 = Expected<[string, number, boolean], TakeFirst<Full, 3>>;
    type _4 = Expected<[string, number, boolean, null], TakeFirst<Full, 4>>;
    type _5 = Expected<never, TakeFirst<Full, 5>>;
  }

  {
    type Full = [string, number, boolean, null];

    type _0 = Expected<[], TakeLast<Full, 0>>;
    type _1 = Expected<[null], TakeLast<Full, 1>>;
    type _2 = Expected<[boolean, null], TakeLast<Full, 2>>;
    type _3 = Expected<[number, boolean, null], TakeLast<Full, 3>>;
    type _4 = Expected<[string, number, boolean, null], TakeLast<Full, 4>>;
    type _5 = Expected<never, TakeLast<Full, 5>>;
  }

  {
    type Full = [string, number, boolean, null];

    type _4 = Expected<[[string, number, boolean, null], []], SplitAt<Full, 4>>;
    type _3 = Expected<[[string, number, boolean], [null]], SplitAt<Full, 3>>;
    type _2 = Expected<[[string, number], [boolean, null]], SplitAt<Full, 2>>;
    type _1 = Expected<[[string], [number, boolean, null]], SplitAt<Full, 1>>;
    type _0 = Expected<[[], [string, number, boolean, null]], SplitAt<Full, 0>>;
  }

  {
    type Strict = ["A" | "B", 1 | 2 | 3, number];
    type _ = Expected<
      ["A" | "B", 1 | 2 | 3, 5],
      NarrowList<Strict, [string, number, 5]>
    >;
  }

  {
    const _str1: CamelCase<"foo_bar"> = "fooBar";
    const _str2: CamelCase<"foo-bar"> = "fooBar";
    const _str3: CamelCase<"__foo_bar__baz__"> = "__fooBar_Baz__";
    const _str4: CamelCase<"-_foo_bar-_baz_-"> = "-_fooBar-Baz_-";
    const _str5: CamelCase<"FooBar"> = "fooBar";
  }

  {
    const _str1: PascalCase<"foo_bar"> = "FooBar";
  }

  {
    const _str1: SnakeCase<"fooBar"> = "foo_bar";
    const _str2: SnakeCase<"FooBar"> = "foo_bar";
    const _str3: SnakeCase<"fooBarABC0D"> = "foo_bar_ABC0D";
    const _str4: SnakeCase<"fooBarABC0DfooBar"> = "foo_bar_ABC0D_foo_bar";
    const _str5: SnakeCase<"foo_bar"> = "foo_bar";
    const _str6: SnakeCase<"foo_Bar"> = "foo_bar";
    // @ts-expect-error
    const _str7: SnakeCase<"fooBar"> = "";
    const _str8: SnakeCase<"foo-bar"> = "foo_bar";
    const _str9: SnakeCase<"foo-Bar"> = "foo_bar";
  }

  {
    const _str1: KebabCase<"fooBar"> = "foo-bar";
    const _str2: KebabCase<"FooBar"> = "foo-bar";
    const _str3: KebabCase<"fooBarABC0D"> = "foo-bar-ABC0D";
    const _str4: KebabCase<"fooBarABC0DfooBar"> = "foo-bar-ABC0D-foo-bar";
    const _str5: KebabCase<"foo_bar"> = "foo-bar";
    const _str6: KebabCase<"foo_Bar"> = "foo-bar";
    // @ts-expect-error
    const _str7: KebabCase<"fooBar"> = "";
    const _str8: KebabCase<"foo-bar"> = "foo-bar";
    const _str9: KebabCase<"foo-Bar"> = "foo-bar";
  }

  {
    type _0 = Expected<false, IsEvenLength<"">>;
    type _1 = Expected<false, IsEvenLength<"a">>;
    type _2 = Expected<true, IsEvenLength<"ab">>;
    type _3 = Expected<false, IsEvenLength<"abc">>;
    type _4 = Expected<true, IsEvenLength<"abcd">>;
    type _5 = Expected<false, IsEvenLength<"abcde">>;
  }

  {
    type _0 = Expected<SplitString<"foobar">, ["f", "o", "o", "b", "a", "r"]>;
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

    type _0 = Expected<
      Join<List1, "">,
      "a12,4,,[object Object],5,6,7b[object Object]8"
    >;

    type _1 = Expected<
      Join<List1, " | ">,
      " | a | 1 | 2,4,,[object Object],5,6,7 | b |  | [object Object] |  | 8"
    >;

    type _2 = Expected<Join<[123], "">, "123">;
    type _3 = Expected<Join<[], ", ">, "">;

    type List2 = [Map<any, any>, Set<any>, Uint16Array, DataView];
    type _4 = Expected<
      Join<List2, " ">,
      "[object Map] [object Set] ${string} [object DataView]"
    >;
  }

  {
    type _0 = Expected<ToString<"foo">, "foo">;
    type _1 = Expected<ToString<123>, "123">;
    type _2 = Expected<ToString<true>, "true">;
    type _3 = Expected<ToString<false>, "false">;
    type _4 = Expected<ToString<Record<never, never>>, "[object Object]">;
    type _5 = Expected<ToString<{ foo: 123 }>, "[object Object]">;
    type _6 = Expected<ToString<[]>, "">;
    type _7 = Expected<ToString<[1, 2, 3]>, "1,2,3">;
    type _8 = Expected<ToString<[1, [2, [3, 4], 5]]>, "1,2,3,4,5">;
    type _9 = Expected<ToString<WeakMap<any, any>>, "[object WeakMap]">;
    type _10 = Expected<string, ToString<Int8Array>>;
    type _11 = Expected<ToString<Int8Array>, "">;
    type _12 = Expected<string, ToString<Float64Array>>;
    type _13 = Expected<ToString<Float64Array>, "">;
    type _14 = Expected<string, ToString<bigint>>;
    type _15 = Expected<ToString<bigint>, "">;
    type _16 = Expected<string, ToString<symbol>>;
    type _17 = Expected<ToString<symbol>, "">;
    type _18 = Expected<string, ToString<typeof globalThis>>;
    type _19 = Expected<ToString<typeof globalThis>, "">;
    type _20 = Expected<ToString<ArrayBuffer>, "[object ArrayBuffer]">;
    type _21 = Expected<
      ToString<SharedArrayBuffer>,
      "[object SharedArrayBuffer]"
    >;
    type _22 = Expected<ToString<DataView>, "[object DataView]">;
    type _23 = Expected<ToString<Promise<any>>, "[object Promise]">;
    type _24 = Expected<string, ToString<() => 2>>;
    type _25 = Expected<ToString<() => 2>, "">;
    type _26 = Expected<string, ToString<GeneratorFunction>>;
    type _27 = Expected<ToString<GeneratorFunction>, "">;
    type _28 = Expected<ToString<Atomics>, "[object Atomics]">;
    type _29 = Expected<ToString<Intl.Collator>, "[object Intl.Collator]">;
    type _30 = Expected<string, ToString<Intl.NumberFormat>>;
    type _31 = Expected<ToString<Intl.NumberFormat>, "">;
    type _32 = Expected<ToString<{ toString(): "foo" }>, "foo">;
  }

  {
    type _0 = Expected<SplitEven<"ab">, ["a", "b"]>;
    type _1 = Expected<SplitEven<"abcd">, ["ab", "cd"]>;
    type _2 = Expected<SplitEven<"abcdef">, ["abc", "def"]>;
  }

  {
    type _0 = Expected<Surround<"foo", "()">, "(foo)">;
    type _1 = Expected<Surround<"foo", "([])">, "([foo])">;
    type _2 = Expected<Surround<"foo", "([{}])">, "([{foo}])">;
  }
});
