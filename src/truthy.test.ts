import { falsy, truthy } from "./truthy.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("truthy & falsy", () => {
  type Num = 0 | 1 | 2;

  {
    const num: Num = 2 as any;

    assertEquals(truthy(num), true);
    assertEquals(falsy(num), false);

    if (truthy(num)) {
      // @ts-expect-error
      const _nf: 0 = num;
      const _nt: 1 | 2 = num;
    } else {
      const _nf: 0 = num;
      // @ts-expect-error
      const _nt: 1 | 2 = num;
    }

    if (falsy(num)) {
      const _nf: 0 = num;
      // @ts-expect-error
      const _nt: 1 | 2 = num;
    } else {
      // @ts-expect-error
      const _nf: 0 = num;
      const _nt: 1 | 2 = num;
    }
  }
});
