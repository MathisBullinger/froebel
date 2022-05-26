import pick from "./pick.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("pick", () => {
  const obj = { a: "foo", b: "bar", c: "baz" };

  const foo = pick(obj, "a", "b");
  assertEquals(foo, { a: "foo", b: "bar" });

  const _a: string = foo.a;
  const _b: string = foo.b;
  // @ts-expect-error
  const _c = foo.c;
});
