import batch from "./batch.ts";
import { assertEquals, assertThrows } from "testing/asserts.ts";

Deno.test("batch", () => {
  assertEquals(batch([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
  assertEquals(batch([1, 2, 3, 4, 5], 6), [[1, 2, 3, 4, 5]]);
  assertEquals(batch([1, 2, 3, 4], 2), [[1, 2], [3, 4]]);
  assertEquals(batch([], 5), []);
  assertEquals(batch([1, 2], Infinity), [[1, 2]]);
  assertThrows(() => batch([1, 2], 0), RangeError);
  assertThrows(() => batch([1, 2], -1), RangeError);
  assertThrows(() => batch([1, 2], NaN), RangeError);
});
