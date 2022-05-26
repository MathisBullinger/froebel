import isPromise, { isNotPromise } from "./isPromise.ts";
import { assertEquals, assertNotEquals } from "testing/asserts.ts";

Deno.test("is promise", () => {
  const prom = new Promise(() => {});

  assertEquals(isPromise(2), false);
  assertEquals(isPromise(""), false);
  assertEquals(isPromise(null), false);
  assertEquals(isPromise({}), false);
  assertEquals(
    isPromise(() => {}),
    false,
  );
  assertEquals(
    isPromise(async () => {}),
    false,
  );
  assertEquals(isPromise({ then: "" }), false);

  assertEquals(isPromise(prom), true);
  assertEquals(isPromise((async () => {})()), true);
  assertEquals(isPromise({ then() {} }), true);

  assertNotEquals(isPromise(1), isNotPromise(1));
  assertNotEquals(isPromise(prom), isNotPromise(prom));
});
