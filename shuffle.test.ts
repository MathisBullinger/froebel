import shuffle from "./shuffle.ts";
import { assert, assertEquals, assertNotEquals } from "testing/asserts.ts";

Deno.test("shuffle", () => {
  const list = [...Array(1e5)].map((_, i) => i);
  const org = [...list];
  const shuffled = shuffle(list);

  assertEquals(list, org);
  assertNotEquals(list, shuffled);
  assert(list.length === shuffled.length);
  assertEquals(shuffled.sort((a, b) => a - b), list);
});
