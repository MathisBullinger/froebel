import callAll from "./callAll.ts";
import { assertEquals } from "testing/asserts.ts";
import { assertSpyCalls, spy } from "testing/mock.ts";

Deno.test("call all", () => {
  const square = spy((n: number) => n ** 2);
  const cube = spy((n: number) => n ** 3);

  assertEquals(callAll([square, cube], 2), [4, 8]);
  assertSpyCalls(square, 1);
  assertSpyCalls(cube, 1);

  // @ts-expect-error
  callAll([(_n: number) => 0]);

  // @ts-expect-error
  callAll([(_n: number) => 0], "");

  // @ts-expect-error
  callAll([square, (_n: string) => 0], 2);

  // @ts-expect-error
  const _str: string[] = callAll([() => 2]);

  // @ts-expect-error
  const [_a, _b] = callAll([() => 2]);
});
