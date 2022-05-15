import { takeList as take } from "./take.ts";
import repeat from "./repeat.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("take", () => {
  {
    let i = 0;
    const iter: IterableIterator<number> = {
      next: () => ({
        value: i++,
      }),
      [Symbol.iterator]() {
        return this;
      },
    };

    assertEquals(take(5, iter), [0, 1, 2, 3, 4]);
  }

  assertEquals(take(5, repeat(1, 2)), [1, 2, 1, 2, 1]);

  {
    let i = 0;
    const iter = {
      next: () => (++i <= 3 ? { value: i - 1 } : { done: true }),
      [Symbol.iterator]() {
        return this;
      },
    };

    const list = take(5, iter as any);
    assertEquals(list, [0, 1, 2]);
  }

  assertEquals(take(5, [1, 2, 3, 4, 5, 6]), [1, 2, 3, 4, 5]);
  assertEquals(take(5, [1, 2, 3]), [1, 2, 3]);
});
