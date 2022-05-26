import bundle, { bundleSync } from "./bundle.ts";
import { assertEquals, assertRejects, assertThrows } from "testing/asserts.ts";
import { assertSpyCallArgs, assertSpyCalls, spy } from "testing/mock.ts";

Deno.test("bundle", async () => {
  const funA = spy((a: number, _b: string) => a);
  const funB = spy((_a: number, b: string) => b);

  assertEquals(await bundle(funA, funB)(1, "a"), undefined);
  assertSpyCalls(funA, 1);

  assertSpyCalls(funB, 1);
  assertSpyCallArgs(funA, 0, [1, "a"]);
  assertSpyCallArgs(funB, 0, [1, "a"]);

  await assertRejects(() =>
    bundle(
      funA,
      (_a, _b) => {
        throw new Error();
      },
      funB,
    )(0, "")
  );
  assertSpyCalls(funA, 2);
  assertSpyCalls(funB, 2);
  assertSpyCallArgs(funA, 1, [0, ""]);
  assertSpyCallArgs(funB, 1, [0, ""]);
});

Deno.test("bundle sync", () => {
  const funA = spy((a: number, _b: string) => a);
  const funB = spy((_a: number, b: string) => b);

  assertEquals(bundleSync(funA, funB)(1, "a"), undefined);
  assertSpyCalls(funA, 1);
  assertSpyCalls(funB, 1);
  assertSpyCallArgs(funA, 0, [1, "a"]);
  assertSpyCallArgs(funB, 0, [1, "a"]);

  assertThrows(() =>
    bundleSync(
      funA,
      (_a, _b) => {
        throw new Error();
      },
      funB,
    )(0, "")
  );
  assertSpyCalls(funA, 2);
  assertSpyCalls(funB, 1);
  assertSpyCallArgs(funA, 1, [0, ""]);
});
