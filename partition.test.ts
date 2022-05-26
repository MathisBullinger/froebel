import partition from "./partition.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("partition", () => {
  const isStr = (v: unknown): v is string => typeof v === "string";

  {
    const res: [["a", "b"], [1, 2]] = partition(
      ["a", 1, "b", 2] as const,
      isStr,
    );
    assertEquals(res[0], ["a", "b"]);
    assertEquals(res[1], [1, 2]);
  }

  {
    const _res = partition(["a", 1, "b", 2], isStr);
    // @ts-expect-error
    const _: [[], []] = partition(["a", 1, "b", 2], isStr);
  }

  {
    const _: [(string | number)[], (string | number)[]] = partition(
      ["a", 1, "b", 2],
      (v) => typeof v === "string",
    );
  }
});
