import radians from "./radians.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("radians", () => {
  assertEquals(radians(180), Math.PI);
  assertEquals(radians(90), Math.PI / 2);
  assertEquals(radians(135), Math.PI * 3/4);
  assertEquals(radians(360), Math.PI * 2);
});
