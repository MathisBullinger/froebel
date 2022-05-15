import ident from "./ident.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("identity function", () => {
  assertEquals(ident(1), 1);
  const obj = {};
  assertEquals(ident(obj), obj);
});
