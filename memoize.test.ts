import memoize from "./memoize.ts";
import { assertEquals, assertThrows } from "testing/asserts.ts";
import { assertSpyCalls, spy } from "testing/mock.ts";

Deno.test("memoize", () => {
  const root = spy((n: number) => Math.sqrt(n));

  const memRoot = memoize(root);

  assertEquals(memRoot(9), 3);
  assertSpyCalls(root, 1);

  assertEquals(memRoot(9), 3);
  assertSpyCalls(root, 1);

  assertEquals(memRoot(16), 4);
  assertSpyCalls(root, 2);

  assertEquals(memRoot(16), 4);
  assertSpyCalls(root, 2);

  memRoot.cache.clear();
  assertEquals(memRoot(9), 3);
  assertSpyCalls(root, 3);

  assertEquals(memRoot(9), 3);
  assertSpyCalls(root, 3);

  const effect = spy((n: number) => n);
  const eff = memoize(effect, { key: (n) => n, limit: 1 });

  assertEquals(eff(1), 1);
  assertSpyCalls(effect, 1);
  assertEquals(eff(1), 1);
  assertSpyCalls(effect, 1);
  assertEquals(eff(2), 2);
  assertSpyCalls(effect, 2);
  assertEquals(eff(2), 2);
  assertSpyCalls(effect, 2);
  assertEquals(eff(1), 1);
  assertSpyCalls(effect, 3);
  assertEquals(eff(2), 2);
  assertSpyCalls(effect, 4);
  assertEquals(eff(1), 1);
  assertSpyCalls(effect, 5);
  assertEquals(eff(1), 1);
  assertSpyCalls(effect, 5);

  const mem = memoize((n: number) => Math.sqrt(n), {
    key: (n) => n,
    weak: true,
  });
  {
    // @ts-expect-error
    const _cache: Map<any, any> = mem.cache;
  }
  {
    const _cache: Map<any, any> = memRoot.cache;
  }

  assertThrows(() =>
    memoize((n: number) => Math.sqrt(n), {
      key: (n) => n,
      weak: true,
      limit: 1,
    })
  );
});
