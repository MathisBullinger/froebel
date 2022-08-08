import pipe, { applyPipe } from "./pipe.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("pipe", async () => {
  // @ts-expect-error
  pipe();
  // @ts-expect-error
  pipe(add, add);
  // @ts-expect-error
  pipe(add, upper);

  const f0: (a: number, b: number) => string = pipe(add, square, toString);
  assertEquals(f0(2, 3), "25");

  const f1: () => Promise<string> = pipe(
    () => "10",
    parseInt,
    asyncSquare,
    toString,
  );
  assertEquals(await f1(), "100");

  const f2: () => Promise<number> = pipe(() => 10, asyncSquare);
  assertEquals(await f2(), 100);
  const f3: () => Promise<number> = pipe(async () => "10", parseInt);
  assertEquals(await f3(), 10);
  const f4: () => Promise<number> = pipe(async () => 10, asyncSquare);
  assertEquals(await f4(), 100);

  assertEquals(pipe(join, parseInt)("1", "2", "3"), 123);

  // @ts-expect-error
  pipe(() => "10", parseInt, asyncSquare, parseInt);
});

Deno.test("apply pipe", () => {
  // @ts-expect-error
  applyPipe();
  // @ts-expect-error
  applyPipe(0 as any, add);
  // @ts-expect-error
  applyPipe(0, parseInt);

  assertEquals(applyPipe(1, toString), "1");
  assertEquals(applyPipe(2, toString, parseInt, square), 4);

  // @ts-expect-error
  const _a: string = applyPipe(2, toString, parseInt);
  const _b: number = applyPipe(2, toString, parseInt);
});

const add = (a: number, b: number) => a + b;
const square = (n: number) => n ** 2;
const toString = (n: number) => n.toString();
const upper = (str: string) => str.toUpperCase();
const join = (...args: string[]) => args.join("");
const asyncSquare = async (n: number) =>
  await new Promise<number>((res) => res(n ** 2));
