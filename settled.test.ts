import { isFulfilled, isRejected } from "./settled.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("settled predicate", async () => {
  const proms: Promise<number>[] = [Promise.resolve(1), Promise.reject("foo")];
  const [a, b] = await Promise.allSettled(proms);

  assertEquals([a, b].map(isFulfilled), [true, false]);
  assertEquals([a, b].map(isRejected), [false, true]);

  if (isFulfilled(a)) {
    const _val: number = a.value;
    // @ts-expect-error
    const _str: string = a.value;
    // @ts-expect-error
    const _err = a.reason;
  }
  if (isRejected(a)) {
    const _err = a.reason;
    // @ts-expect-error
    const _val = a.value;
  }
});
