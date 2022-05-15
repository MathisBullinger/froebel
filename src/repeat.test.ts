import repeat from "./repeat.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("repeat", () => {
  const result: number[] = [];
  for (const n of repeat(1, 2, 3)) {
    result.push(n);
    if (result.length >= 9) break;
  }
  assertEquals(result, [1, 2, 3, 1, 2, 3, 1, 2, 3]);
});
