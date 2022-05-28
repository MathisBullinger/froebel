import promisify from "./promisify.ts";
import type { λ } from "./types.ts";
import { assert, assertEquals, assertRejects } from "testing/asserts.ts";

Deno.test("promisify", async () => {
  {
    const callbackAPI = (cb: λ<[number]>) => {
      setTimeout(() => cb(1), 100);
    };

    // @ts-expect-error
    const _promiseAPI: () => Promise<string> = promisify(callbackAPI);
    const promiseAPI: () => Promise<number> = promisify(callbackAPI);
    assertEquals(await promiseAPI(), 1);

    assertEquals(await promisify(callbackAPI, null)(), undefined);
  }

  {
    const callbackAPI = (_cb: λ) => {
      throw Error("foo");
    };

    await assertRejects(promisify(callbackAPI), Error, "foo");
  }

  {
    const callbackAPI = async (_cb: λ) => {
      await new Promise((res) => setTimeout(res, 10));
      throw Error("bar");
    };
    await assertRejects(promisify(callbackAPI), Error, "bar");
  }

  {
    const callbackAPI = (cb: λ<[err?: Error, res?: string]>) => {
      cb(Error("baz"));
    };
    await assertRejects(promisify(callbackAPI, 1, 0));
    assert((await promisify(callbackAPI)()) instanceof Error);
  }

  await assertRejects(
    promisify(
      async (cb: λ) => {
        await new Promise((res) => setTimeout(res, 10));
        cb(Error("foo"));
        throw Error("bar");
      },
      null,
      0,
    ),
    Error,
    "foo",
  );

  assertEquals(
    await promisify(
      async (cb: λ) => {
        await new Promise((res) => setTimeout(res, 10));
        cb(null, 123);
        throw Error("foo");
      },
      1,
      0,
    )(),
    123,
  );

  {
    const callbackAdd = (a: number, b: number, cb: λ<[number]>) =>
      setTimeout(() => cb(a + b), 200);

    assertEquals(await promisify(callbackAdd).callbackLast(1, 2), 3);
    // @ts-expect-error
    await promisify(callbackAdd).callbackLast(1, "a");
  }

  {
    const callbackAdd = (cb: λ<[number]>, a: number, b: number) =>
      setTimeout(() => cb(a + b), 200);

    assertEquals(await promisify(callbackAdd).callbackFirst(1, 2), 3);
    // @ts-expect-error
    await promisify(callbackAdd).callbackFirst(1, "a");
  }
});
