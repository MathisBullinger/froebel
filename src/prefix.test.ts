import prefix from "./prefix.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("prefix", () => {
  const pre1: "foobar" = prefix("foo", "bar");
  assertEquals(pre1, "foobar");

  const pre2: "fooBar" = prefix("foo", "bar", "camel");
  assertEquals(pre2, "fooBar");

  const pre3: "foo_bar" = prefix("foo", "bar", "snake");
  assertEquals(pre3, "foo_bar");
});
