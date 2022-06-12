import surround from "./surround.ts";
import { assertEquals, assertThrows } from "testing/asserts.ts";

Deno.test("surround", () => {
  assertEquals(surround("foo", "()"), "(foo)");
  assertEquals(surround("foo", "([])"), "([foo])");
  assertEquals(surround("foo", ""), "foo");
  assertThrows(() => surround("foo", "abc"));

  const _0: "[({foo})]" = surround("foo", "[({})]");
  // @ts-expect-error
  const _1: "[{(foo)}]" = surround("foo", "[({})]");
  const _2: "foo" = surround("foo", "");
});
