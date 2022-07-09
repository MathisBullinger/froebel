import map from "./map.ts";
import { assertEquals, assertThrows } from "testing/asserts.ts";

Deno.test("map", () => {
  {
    const input = { foo: 1, [Symbol("bar")]: 2 };
    const mapped = map(input, (k, v) => [k, v]);
    type _0 = Expect<typeof mapped, Record<string | symbol, number>>;
    assertEquals(mapped, input);
    // @ts-expect-error
    type _1 = Expect<typeof mapped, Record<string, number>>;
    // @ts-expect-error
    type _2 = Expect<typeof mapped, Record<string | symbol, string>>;
  }

  {
    const input = new Map<string, string>([["1", "2"], ["3", "4"]]);
    const mapped: Map<number, number> = map(
      input,
      (key, value) => [parseInt(key), parseInt(value)],
    );
    assertEquals(mapped, new Map([[1, 2], [3, 4]]));
  }

  {
    const input = ["1", "2", "3"];
    const mapped: number[] = map(input, (v) => parseInt(v));
    assertEquals(mapped, [1, 2, 3]);
  }

  {
    const input = new Set(["1", "2", "3"]);
    const mapped: Set<number> = map(input, (v) => parseInt(v));
    assertEquals(mapped, new Set([1, 2, 3]));
  }

  // @ts-expect-error
  assertThrows(() => map(null, (k, v) => [k, v]), TypeError);
});

type Expect<T, U extends T> = 0;
