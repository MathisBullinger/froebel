import convertAngle from "./convertAngle.ts";
import { AssertionError, assertEquals, assertThrows } from "testing/asserts.ts";

Deno.test("convertAngle", () => {
  assertEquals(convertAngle(123, "degree", "degree"), 123);
  assertEquals(convertAngle(123, "radian", "radian"), 123);

  assertEquals(convertAngle(0, "degree", "radian"), 0);
  assertEquals(convertAngle(0, "radian", "degree"), 0);

  assertEquals(convertAngle(180, "degree", "radian"), Math.PI);
  assertEquals(convertAngle(360, "degree", "radian"), Math.PI * 2);
  assertEquals(convertAngle(Math.PI, "radian", "degree"), 180);
  assertEquals(convertAngle(Math.PI * 2, "radian", "degree"), 360);

  // @ts-ignore
  assertThrows(() => convertAngle(0, "invalidUnit", "radian"), AssertionError);
  // @ts-ignore
  assertThrows(() => convertAngle(0, "degree", "invalidUnit"), AssertionError);
});
