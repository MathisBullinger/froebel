import suffix from "./suffix.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("suffix", () => {
  const suf1: "foobar" = suffix("foo", "bar");
  assertEquals(suf1, "foobar");

  const suf2: "fooBar" = suffix("foo", "bar", "camel");
  assertEquals(suf2, "fooBar");

  const suf3: "foo_bar" = suffix("foo", "bar", "snake");
  assertEquals(suf3, "foo_bar");
});
