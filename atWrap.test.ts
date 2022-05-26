import atWrap from "./atWrap.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("atWrap", () => {
  const list = [0, 1, 2];

  assertEquals(atWrap(list, 0), 0);
  assertEquals(atWrap(list, 1), 1);
  assertEquals(atWrap(list, 2), 2);
  assertEquals(atWrap(list, 3), 0);
  assertEquals(atWrap(list, 4), 1);
  assertEquals(atWrap(list, 13), 1);

  assertEquals(atWrap(list, -1), 2);
  assertEquals(atWrap(list, -2), 1);
  assertEquals(atWrap(list, -3), 0);
  assertEquals(atWrap(list, -4), 2);
  assertEquals(atWrap(list, -5), 1);
  assertEquals(atWrap(list, -14), 1);
});
