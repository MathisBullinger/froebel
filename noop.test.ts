import noop from "./noop.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("noop", () => {
  assertEquals(noop(), undefined);
  // @ts-expect-error
  const _return: undefined = noop();
});
