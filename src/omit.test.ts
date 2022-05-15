import omit from "./omit.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("omit", () => {
  const obj = { a: "foo", b: "bar", c: "baz" };

  const foo = omit(obj, "b", "c");
  assertEquals(foo, { a: "foo" });

  const _a: string = foo.a;
  // @ts-expect-error
  const _b = foo.b;
  // @ts-expect-error
  const _c = foo.c;
});
