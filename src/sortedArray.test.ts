import Sorted, { SortedArray } from "./sortedArray.ts";
import { assert, assertEquals } from "testing/asserts.ts";

Deno.test("SortedArray", () => {
  const cmp = (a: number, b: number) => a - b;

  assertEquals([...new Sorted(cmp, 2, 1, 3)], [1, 2, 3]);

  {
    const arr = new Sorted(cmp);
    arr.add(2);
    arr.add(1);
    arr.add(3);
    assertEquals([...arr], [1, 2, 3]);
  }

  const arr = new Sorted<number>(cmp);

  arr.add(2, 1, 3);
  assertEquals([...arr], [1, 2, 3]);

  assertEquals(arr.indexOf(2), 1);

  assertEquals(arr instanceof Sorted, true);

  arr.add(5, 6, 4);
  assertEquals([...arr], [1, 2, 3, 4, 5, 6]);

  assertEquals(arr.delete(1, 3), [2, 4]);
  assertEquals([...arr], [1, 3, 5, 6]);
  assertEquals(arr.delete(3, 0, 2), [6, 1, 5]);
  assertEquals([...arr], [3]);
  assertEquals(arr.delete(0), [3]);
  assertEquals([...arr], []);

  arr.add(0, 1, 2, 3, 4);
  arr.delete(0, -1);
  assertEquals([...arr], [1, 2, 3]);

  // @ts-ignore
  delete arr[1];
  assertEquals([...arr], [1, 3]);

  assertEquals(arr.length, 2);
  arr.clear();
  assertEquals([...arr], []);
  assertEquals(arr.length, 0);

  arr.add(1, 2, 3);

  // @ts-expect-error
  arr.find((_value: number, _index: number, _obj: number[]) => false);
  arr.find((_value: number, _index: number, _obj: SortedArray<number>) =>
    false
  );
  let fArgs: any[] = [];
  arr.find((...args) => {
    fArgs = args;
  });
  assertEquals(fArgs[0], 3);
  assertEquals(fArgs[1], 2);
  assert(fArgs[2] instanceof Sorted);

  {
    const sliced = arr.slice(1);
    assertEquals([...sliced], [2, 3]);
    assert(sliced instanceof Sorted);
  }

  {
    const org = Sorted.from(cmp, arr);
    org.add(3);
    const filtered = org.filter((n, i, a) => n % 2 && a.indexOf(n) === i);
    assertEquals([...filtered], [1, 3]);
    assert(filtered instanceof Sorted);
  }

  const _valNum: number = arr[0];
  // @ts-expect-error
  const _valStr: string = arr[0];
  // @ts-expect-error
  arr[0] = 1;
});
