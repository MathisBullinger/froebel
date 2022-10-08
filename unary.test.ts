import unary from "./unary.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("unary", async () => {
  // @ts-expect-error
  unary(() => {});
  unary((_a: any) => {});
  unary((_a?: any) => {});
  unary((_a: any, _b?: any) => {});
  // @ts-expect-error
  unary((_a: any, _b: any) => {});
  unary((..._args: any[]) => {});
  unary((_a: any, ..._args: any[]) => {});
  unary((_a?: any, ..._args: any[]) => {});
  unary((_a: any, _b?: any, ..._args: any[]) => {});
  // @ts-expect-error
  unary((_a: any, _b: any, ..._args: any[]) => {});

  const parseInt10 = unary(parseInt);

  assertEquals(parseInt10("10"), 10);
  // @ts-expect-error
  assertEquals(parseInt10("10", 16), 10);
  // @ts-expect-error
  assertEquals(parseInt10(), NaN);
  assertEquals(["1", "2", "3"].map(parseInt10), [1, 2, 3]);

  const asyncTest = async (a: number, b = 2) =>
    await new Promise<number>((res) => setTimeout(() => res(a * b)));
  const asyncUnary = unary(asyncTest);
  assertEquals(await asyncUnary(3), 6);
});
