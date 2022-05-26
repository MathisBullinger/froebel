import { limitInvocations, once } from "./invoke.ts";
import { assertEquals, assertThrows } from "testing/asserts.ts";

Deno.test("once", () => {
  once(() => {});
  once(
    () => {},
    // @ts-expect-error
    (_arg) => {},
  );
  once(
    () => {},
    () => {},
  );
  // @ts-expect-error
  once(() => 0);
  once(
    () => 0,
    () => 0,
  );
  once(
    () => 0,
    // @ts-expect-error
    () => "",
  );
  once(
    () => 0,
    // @ts-expect-error
    async () => 0,
  );

  once(async () => {});
  // @ts-expect-error
  once(async () => 0);
  once(
    async () => 0,
    async () => 0,
  );
  once(
    async () => 0,
    () => 0,
  );

  // @ts-expect-error
  once((_n: number) => {})();
  once((_n: number) => {})(1);
  // @ts-expect-error
  once((_n: number) => {})(1, 2);
  // @ts-expect-error
  once((_a: number, _b: strin) => {})(1);
  once((_a: number, _b: string) => {})(1, "a");

  const _rn: number = once(
    () => 1,
    () => 2,
  )();
  // @ts-expect-error
  const _rs: string = once(
    () => 1,
    () => 2,
  )();

  {
    const f = once(
      () => 1,
      () => 2,
    );
    assertEquals(f(), 1);
    assertEquals(f(), 2);
    assertEquals(f(), 2);
  }
});

Deno.test("limit", () => {
  const f = limitInvocations(
    () => "a",
    2,
    () => "b",
  );
  assertEquals(f(), "a");
  assertEquals(f(), "a");
  assertEquals(f(), "b");

  const f3 = limitInvocations(
    () => 0,
    3,
    () => {
      throw Error("4th invoke");
    },
  );
  assertEquals(f3(), 0);
  assertEquals(f3(), 0);
  assertEquals(f3(), 0);
  assertThrows(() => f3(), Error, "4th invoke");
});
