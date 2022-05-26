import { asyncNullishChain, nullishChain } from "./nullishChain.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("nullish chain", () => {
  const numChain = nullishChain(
    (n: number) => (n === 1 ? n : null),
    (n) => (n === 2 ? n : undefined),
    (n) => (n === 3 ? n : null),
  );

  assertEquals(numChain(1), 1);
  assertEquals(numChain(2), 2);
  assertEquals(numChain(3), 3);
  assertEquals(numChain(4), undefined);

  // @ts-expect-error
  // prettier-ignore
  nullishChain((_n: number) => 0, (_n: string) => 0);

  // @ts-expect-error
  const _str: string = nullishChain(() => 2)();

  const _empty = nullishChain();
});

Deno.test("async nullish chain", async () => {
  const chain = asyncNullishChain(
    (n: number) => {
      if (n === 1) return "foo";
    },
    async (n) => {
      if (n === 2) return "bar";
    },
    (n) =>
      new Promise<string | null>((res) =>
        setTimeout(() => res(n === 3 ? "baz" : null), 100)
      ),
  );

  assertEquals(await chain(1), "foo");
  assertEquals(await chain(2), "bar");
  assertEquals(await chain(3), "baz");
  assertEquals(await chain(4), undefined);
});
