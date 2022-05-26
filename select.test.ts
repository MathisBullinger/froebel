import select, { none } from "./select.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("select path", () => {
  const obj = {
    a: {
      b: "c",
    },
    d: "e",
    f: undefined,
  } as const;

  assertEquals(select(obj, "a"), { b: "c" });
  assertEquals(select(obj, "a", "b"), "c");
  assertEquals(select(obj, "f"), undefined);
  assertEquals(select(obj, "z"), none);
  assertEquals(select(obj, "a", "z"), none);
  assertEquals(select(obj, "d", "e"), none);

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
});
