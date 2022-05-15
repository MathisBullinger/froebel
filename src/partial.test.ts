import partial from "./partial.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("partial application", () => {
  const fun = (a: string, b: number, c: boolean) => JSON.stringify([a, b, c]);

  const funABC = partial(fun);
  const funBC = partial(fun, "a");
  const funC = partial(fun, "b", 2);
  const fun_ = partial(fun, "c", 3, true);

  assertEquals(funABC("_", 0, false), JSON.stringify(["_", 0, false]));
  assertEquals(funBC(1, true), JSON.stringify(["a", 1, true]));
  assertEquals(funC(false), JSON.stringify(["b", 2, false]));
  assertEquals(fun_(), JSON.stringify(["c", 3, true]));

  // @ts-expect-error
  partial((_str: "A" | "B", _v: boolean) => {}, "A")();
});
