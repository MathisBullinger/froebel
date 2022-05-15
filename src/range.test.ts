import range, { alphaRange, numberRange } from "./range.ts";
import { assertEquals, assertThrows } from "testing/asserts.ts";

Deno.test("range", () => {
  assertEquals(range(1, 3), [1, 2, 3]);
  assertEquals(range(1, 3.5), [1, 2, 3]);
  assertEquals(range(1, 2.5), [1, 2]);

  assertEquals(range(3, 1), [3, 2, 1]);
  assertEquals(range(3, 0.5), [3, 2, 1]);
  assertEquals(range(3, 1.5), [3, 2]);

  assertEquals(range(0, 1, 0.2), [0, 0.2, 0.2 * 2, 0.2 * 3, 0.2 * 4, 0.2 * 5]);

  assertEquals(range("a", "d"), "abcd".split(""));
  assertEquals(range("d", "a"), "dcba".split(""));

  assertThrows(() => alphaRange("foo", "bar"), RangeError);
  assertThrows(() => numberRange(1, 2, -1), RangeError);
  assertThrows(() => numberRange(2, 1, 1), RangeError);
});
