import zip, { zipWith } from "./zip.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("zip", () => {
  {
    const pairs: [number, string][] = zip([1, 2, 3], ["a", "b", "c"]);
    assertEquals(pairs, [
      [1, "a"],
      [2, "b"],
      [3, "c"],
    ]);
  }

  assertEquals(zip([1], ["a", "b"]), [[1, "a"]]);

  assertEquals(zip([1, 2, 3], [true, false, true], ["a", "b", "c"]), [
    [1, true, "a"],
    [2, false, "b"],
    [3, true, "c"],
  ]);

  assertEquals(zip([1, 2, 3]), [[1], [2], [3]]);
});

Deno.test("zipWith", () => {
  const sums: number[] = zipWith((a, b) => a + b, [1, 2, 3], [4, 5, 6]);
  assertEquals(sums, [5, 7, 9]);

  // @ts-expect-error
  zipWith((n: string) => n, [1]);
});
