import degrees from "./degrees.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("degrees", () => {
  assertEquals(degrees(Math.PI), 180);
  assertEquals(degrees(Math.PI / 2), 90);
  assertEquals(degrees(Math.PI * 3/4), 135);
  assertEquals(degrees(Math.PI * 2), 360);
});
