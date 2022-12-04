import { assert, assertEquals } from "testing/asserts.ts";
import { assertType } from "./types.ts";
import merge, { Merge } from "./merge.ts";

Deno.test("merge", () => {
  {
    const result: 2 = merge(1, 2);
    assertEquals(result, 2);
  }

  {
    const result = merge({ foo: "bar" }, null);
    assertType<typeof result, null>();
    assertEquals(result, null);
  }

  {
    const result = merge(null, { foo: "bar" } as const);
    assertType<typeof result, { foo: "bar" }>();
    assertEquals(result, { foo: "bar" });
  }

  {
    const result = merge(null, { foo: "bar" } as const);
    assertType<typeof result, { foo: "bar" }>();
    assertEquals(result, { foo: "bar" });
  }

  {
    const result = merge(
      { a: 1, b: { foo: "bar", c: "d" } } as const,
      { a: 2, b: { foo: "baz", e: "f" } } as const,
    );

    assertType<
      typeof result,
      { a: 2; b: { foo: "baz"; c: "d"; e: "f" } }
    >();
    assertEquals(
      result,
      { a: 2, b: { foo: "baz", c: "d", e: "f" } },
    );
  }

  {
    const result = merge([1, 2] as const, [3, 4] as const);
    assertType<typeof result, [1, 2, 3, 4]>();
    assertEquals(result, [1, 2, 3, 4]);
  }

  {
    assertEquals(merge(new Set([1, 2]), new Set([2, 3])), new Set([1, 2, 3]));
    assertEquals(merge([1, 2], new Set([2, 3])), new Set([2, 3]));

    assertEquals(
      merge(new Map([[1, 2], [3, 4]]), new Map([[5, 6]])),
      new Map([[1, 2], [3, 4], [5, 6]]),
    );

    assertType<Merge<Set<number>, Set<string>>, Set<number | string>>();
    assertType<
      Merge<{ foo: any[] }, { foo: Set<string> }>,
      { foo: Set<string> }
    >();
    assertType<
      Merge<null | Set<string>, Set<number>>,
      Set<number> | Set<string | number>
    >();
    assertType<
      Merge<Map<string, number>, Map<number, number>>,
      Map<string | number, number>
    >();
  }

  {
    const v = { foo: "bar" };
    assertEquals(merge({}, v), v);
    assert(merge({}, v) !== v);
  }

  {
    const v = [1, 2, 3];
    assertEquals(merge({}, v), v);
    assert(merge({}, v) !== v);
  }

  {
    const v = new Set([1, 2, 3]);
    assertEquals(merge({}, v), v);
    assert(merge({}, v) !== v);
  }

  {
    const v = new Map([]);
    assertEquals(merge({}, v), v);
    assert(merge({}, v) !== v);
  }

  {
    type V = { foo: V };
    const v = {} as V;
    v.foo = v;

    const result = merge(v, v);
    assertType<typeof result, V>();
    assertEquals(result, v);
    assert(result.foo === result);
    assert(result.foo !== v);
  }

  {
    type V = [1, 2, V];
    const v = [1, 2] as unknown as V;
    v.push(v);
    const result = merge(v, v);
    assertType<typeof result, [...V, ...V]>();
    assert(result[2] !== v);
    // @ts-ignore
    assert(result[2] === result);
  }

  {
    const v = new Set();
    v.add(v);
    const ref = {};
    v.add(ref);
    const result = merge(v, v);
    assert(!result.has(v));
    assert(result.has(result));
    assert(result.has(ref));
  }

  {
    const a = new Map();
    a.set(a, a);
    a.set("a", a);
    a.set("foo", a);
    const b = new Map();
    b.set(b, b);
    b.set("b", b);
    b.set("foo", b);

    const result = merge(a, b);
    assertEquals(result.get("a"), result);
    assertEquals(result.get("b"), result);
    assertEquals(result.get("foo"), result);
    assertEquals([...result], [
      ["a", result],
      ["foo", result],
      ["b", result],
      [result, result],
    ]);
  }

  assertType<Merge<number[], string[]>, (string | number)[]>();
  assertType<Merge<".", {}>, {}>();
  assertType<Merge<{}, ".">, ".">();

  assertType<
    Merge<{ foo: "bar" }, number | { foo: "baz" }>,
    number | { foo: "baz" }
  >();
  assertType<
    Merge<number | { a: 2; foo: "bar" }, { a: 1 }>,
    { a: 1 } | { a: 1; foo: "bar" }
  >();
  assertType<
    Merge<string | { a: 1; d: 4 }, number | { a: 2; c: 3 }>,
    number | { a: 2; c: 3 } | { a: 2; c: 3; d: 4 }
  >();

  assertType<Merge<{ a?: 1 }, { a: 2 }>, { a: 2 }>();
  assertType<Merge<{ a: 1 }, { a?: 2 }>, { a: 1 | 2 | undefined }>();

  assertType<Merge<{ a?: 1 }, {}>, { a?: 1 }>();
  assertType<Merge<{ a?: 1 }, { a?: 2 }>, { a?: 1 | 2 }>();

  assertType<Merge<number[] | [1, 2], [3, 4]>, number[] | [1, 2, 3, 4]>();
});
