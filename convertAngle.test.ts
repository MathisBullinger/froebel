import convertAngle from "./convertAngle.ts";
import { assertEquals, assertThrows } from "testing/asserts.ts";

Deno.test("convertAngle", () => {
  assertEquals(convertAngle(123, "degree", "degree"), 123);
  assertEquals(convertAngle(123, "radian", "radian"), 123);
  assertThrows(() => convertAngle(123, "invalidUnit", "invalidUnit"), 123);

  assertEquals(convertAngle(0, "degree", "radian"), 0);
  assertEquals(convertAngle(0, "radian", "degree"), 0);

  assertEquals(convertAngle(180, "degree", "radian"), Math.PI);
  assertEquals(convertAngle(360, "degree", "radian"), Math.PI * 2);
  assertEquals(convertAngle(Math.PI, "radian", "degree"), 180);
  assertEquals(convertAngle(Math.PI * 2, "radian", "degree"), 360);
  
  assertThrows(() => convertAngle(0, "invalidUnit", "radian"), TypeError);
  assertThrows(() => convertAngle(0, "degree", "invalidUnit"), TypeError);
});
