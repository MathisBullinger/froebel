import select, { none } from "./select.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("select path", () => {
  const ref = {};

  const obj = {
    a: {
      b: "c",
    },
    d: "e",
    f: undefined,
    g: [{ foo: "bar" }, { foo: "baz" }],
    map: new Map([["a", "b"], ["c", "d"]]),
    map2: new Map<unknown, string>(),
    boolMap: new Map<boolean, number>(),
    nestMap: new Map([["a", [
      0,
      new Map([[ref, { foo: "bar" }]]),
    ]]]),
  } as const;

  assertEquals(select(obj, "a"), { b: "c" });
  assertEquals(select(obj, "a", "b"), "c");
  assertEquals(select(obj, "f"), undefined);
  assertEquals(select(obj, "z"), none);
  assertEquals(select(obj, "a", "z"), none);
  assertEquals(select(obj, "d", "e"), none);
  assertEquals(select(obj, "g", 0, "foo"), "bar");
  assertEquals(select(obj, "g", 1, "foo"), "baz");
  assertEquals(select(obj, "map", "a"), "b");
  assertEquals(select(obj, "map", "c"), "d");
  assertEquals(select(obj, "map", "e"), none);
  assertEquals(select(obj, "nestMap", "a", 1, ref, "foo"), "bar");

  {
    const _a_b: "c" = select(obj, "a", "b");
    const _a_z: typeof none = select(obj, "a", "z");
  }
  {
    // @ts-expect-error
    const _a_b2: "c" = select(obj as unknown, "a", "b");
    const _a_b1: unknown = select(obj as unknown, "a", "b");

    // @ts-expect-error
    const _a_z1: typeof none = select(obj as unknown, "a", "z");
    const _a_z2: unknown = select(obj as unknown, "a", "z");
  }
  {
    // @ts-expect-error
    const _bm_f1: number = select(obj, "boolMap", false);
    // @ts-expect-error
    const _bm_f2: string | typeof none = select(obj, "boolMap", false);
    const _bm_f3: number | typeof none = select(obj, "boolMap", false);

    const _m_k1: typeof none = select(obj, "map", 2);
    const _m_k2: string | typeof none = select(obj, "map", "foo");

    const _m2_k1: string | typeof none = select(obj, "map2", "a");
    const _m2_k2: string | typeof none = select(obj, "map2", 2);
  }
});
