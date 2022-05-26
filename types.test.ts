import type {
  CamelCase,
  NarrowList,
  SnakeCase,
  SplitAt,
  TakeFirst,
  TakeLast,
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
    const _str2: CamelCase<"__foo_bar__baz__"> = "__fooBar_Baz__";
    const _str3: CamelCase<"FooBar"> = "fooBar";
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
  }
});
