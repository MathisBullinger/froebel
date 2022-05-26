import unzip, { unzipWith } from "./unzip.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("unzip", () => {
  {
    const unzipped: [number[], string[]] = unzip([1, "a"], [2, "b"], [3, "c"]);
    assertEquals(unzipped, [
      [1, 2, 3],
      ["a", "b", "c"],
    ]);
  }

  {
    const unzipped = unzip([1, true, "a"], [2, false, "b"], [3, true, "c"]);
    assertEquals(unzipped, [
      [1, 2, 3],
      [true, false, true],
      ["a", "b", "c"],
    ]);
  }

  // @ts-expect-error
  unzip([1, "a"], [2]);
});

Deno.test("unzipWith", () => {
  const [nums, str]: [number[], string] = unzipWith(
    [
      [1, "a"],
      [2, "b"],
      [3, "c"],
    ],
    (n, a: number[] = []) => [...a, n],
    (c, str = "") => str + c,
  );

  assertEquals(nums, [1, 2, 3]);
  assertEquals(str, "abc");
});
