import clone from "./clone.ts";
import { assertEquals, assertNotStrictEquals } from "testing/asserts.ts";

Deno.test("clone", () => {
  assertEquals(clone(1), 1);
  assertEquals(clone(null), null);
  assertEquals(clone("foo"), "foo");

  {
    const v = [1, "a", { foo: ["bar", { baz: [[2, 3]] }, "a"] }];
    assertEquals(clone(v), v);
    assertNotStrictEquals(clone(v), v);
  }

  {
    const v: any = {};
    v.p = v;

    const cloned = clone(v);
    assertEquals(cloned, v);
    assertNotStrictEquals(cloned, v);

    assertEquals(cloned.p, cloned);
    assertNotStrictEquals(cloned.p, v);
  }

  {
    const v: any = { foo: {} };
    v.foo.bar = v;

    const cloned = clone(v);
    assertEquals(cloned, v);
    assertNotStrictEquals(cloned, v);

    assertEquals(cloned.foo.bar, cloned);
    assertNotStrictEquals(cloned.foo.bar, v);
  }
});
