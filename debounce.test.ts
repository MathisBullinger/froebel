import debounce from "./debounce.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test(
  "debounce",
  () =>
    new Promise<void>((done) => {
      const args: number[] = [];

      const fun = (n: number) => {
        args.push(n);
      };

      const debounced = debounce(fun, 50);

      let i = 0;
      const iid = setInterval(() => {
        debounced(++i);
        if (i === 3) clearInterval(iid);
      }, 5);

      setTimeout(() => {
        assertEquals(args.length, 1);
        assertEquals(args[0], 3);
        done();
      }, 100);
    }),
);

Deno.test(
  "cancel debounce",
  () =>
    new Promise<void>((done) => {
      const debounced = debounce(() => {
        throw Error();
      }, 25);

      debounced();
      setTimeout(() => debounced[debounce.cancel](), 10);

      setTimeout(done, 35);
    }),
);
