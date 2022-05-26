import clamp from "./clamp.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("clamp", () => {
  assertEquals(clamp(0, 2, 1), 1);
  assertEquals(clamp(-2, -Infinity, 10), -2);
  assertEquals(clamp(20, 25, 30), 25);
  assertEquals(clamp(30, 25, 20), 25);
  assertEquals(clamp(30, 50, 20), 30);
});
