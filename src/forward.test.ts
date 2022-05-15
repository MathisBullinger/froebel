import forward from "./forward.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("forward arguments", () => {
  const fun = (a: string, b: number, c: boolean) => JSON.stringify([a, b, c]);

  const funA = forward(fun, 1, true);
  assertEquals(funA("a"), JSON.stringify(["a", 1, true]));

  const funAB = forward(fun, false);
  assertEquals(funAB("b", 2), JSON.stringify(["b", 2, false]));
});
