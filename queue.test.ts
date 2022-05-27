import createQueue from "./queue.ts";
import { assert, assertEquals, assertRejects } from "testing/asserts.ts";

Deno.test("queue", async () => {
  const logs: string[] = [];
  const queue = createQueue();

  const returns = await Promise.all([
    queue(async () => {
      logs.push("enter a");
      await wait(10);
      logs.push("return a");
      return "a";
    }),
    queue(async () => {
      logs.push("enter b");
      await wait(20);
      logs.push("return b");
      return "b";
    }),
    queue(() => {
      logs.push("enter c");
      logs.push("return c");
      return "c";
    }),
    await queue(async () => {
      logs.push("enter d");
      await wait(10);
      logs.push("return d");
      return "d";
    }),
  ]);

  assertEquals(returns, ["a", "b", "c", "d"]);
  assertEquals(logs, [
    "enter a",
    "return a",
    "enter b",
    "return b",
    "enter c",
    "return c",
    "enter d",
    "return d",
  ]);
});

Deno.test("queue (reject)", async () => {
  const queue = createQueue();

  assertRejects(() =>
    queue(() => {
      throw Error();
    })
  );
  const a = queue(async () => {
    await wait(10);
    return 1;
  });
  assertRejects(() =>
    queue(async () => {
      await wait(10);
      throw Error();
    })
  );
  const c = queue(async () => {
    await wait(10);
    return 3;
  });

  const done = queue.done;
  assert(done instanceof Promise);
  assertEquals(await a, 1);
  assertEquals(await c, 3);
  assert(queue.done === true);
  assertEquals(await done, undefined);
});

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
