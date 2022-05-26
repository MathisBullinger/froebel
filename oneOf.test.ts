import oneOf from "./oneOf.ts";
import { assert } from "testing/asserts.ts";

Deno.test("oneOf", () => {
  {
    const unknown: unknown = 2;
    assert(oneOf(unknown as any, 1, 2, 3));
    if (oneOf(unknown, 1, 2, 3)) {
      const _n: number = unknown;
    } else {
      // @ts-expect-error
      const _n: number = unknown;
    }
  }

  {
    const unknown: unknown = "a";
    assert(oneOf(unknown as any, 1, 2, "a", "b"));
    if (oneOf(unknown, 1, 2, "a", "b")) {
      const _sOrN: string | number = unknown;
    } else {
      // @ts-expect-error
      const _sOrN: string | number = unknown;
    }
  }

  {
    const unknown: unknown = "foo";
    if (oneOf(unknown, "foo", "bar")) {
      const _known: "foo" | "bar" = unknown;
    }
  }

  {
    const unknown: unknown = 2;
    if (oneOf(unknown, 1, 2)) {
      const _known: 1 | 2 = unknown;
    }
  }

  {
    const unknown: unknown = 1;
    if (oneOf(unknown, 1, 2, "a", "b")) {
      const _known: 1 | 2 | "a" | "b" = unknown;
    }
  }
});
