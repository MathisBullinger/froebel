import * as T from "./arithmetic.ts";

Deno.test("static arithmetic type tests", () => {
  expectType<T.Add<2, 1>, 3>();
  // @ts-expect-error
  expectType<T.Add<2, 2>, 3>();

  expectType<T.Subtract<3, 2>, 1>();
  // @ts-expect-error
  expectType<T.Subtract<3, 1>, 1>();

  expectType<T.Multiply<4, 5>, 20>();
  // @ts-expect-error
  expectType<T.Multiply<4, 5>, 19>();

  expectType<T.Multiply<10, 0>, 0>();
  expectType<T.Multiply<0, 5>, 0>();
  expectType<T.Multiply<0, 0>, 0>();

  expectType<T.Greater<10, 9>, true>();
  expectType<T.Greater<10, 10>, false>();
  expectType<T.Greater<10, 11>, false>();
  // @ts-expect-error
  expectType<T.Greater<10, 9>, false>();
  // @ts-expect-error
  expectType<T.Greater<10, 10>, true>();
  // @ts-expect-error
  expectType<T.Greater<10, 11>, true>();

  expectType<T.Smaller<10, 9>, false>();
  expectType<T.Smaller<9, 9>, false>();
  expectType<T.Smaller<8, 9>, true>();
});

const expectType = <T, Expected extends T>() => {};
