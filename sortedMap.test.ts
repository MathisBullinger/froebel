import SortedMap from "./sortedMap.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("SortedMap", () => {
  const entries: [string, string][] = [
    ["a", "foo"],
    ["b", "bar"],
    ["c", "baz"],
  ];
  const keys = () => entries.map(([k]) => k);
  const values = () => entries.map(([, v]) => v);

  assertEquals(
    [
      ...new SortedMap(
        (_va, _vb, a, b) => a.localeCompare(b),
        [entries[1], entries[0], entries[2]],
      ),
    ],
    entries,
  );

  const map = new SortedMap<string, string>((_va, _vb, a, b) =>
    a.localeCompare(b)
  );

  map.set(...entries[1]);
  map.set(...entries[0]);
  map.set(...entries[2]);

  assertEquals([...map], entries);
  assertEquals([...map.entries()], entries);
  assertEquals([...map.keys()], keys());
  assertEquals([...map.values()], values());
  assertEquals(
    map.map((v) => v),
    values(),
  );
  assertEquals(
    map.map((_, k) => k),
    keys(),
  );

  const fe: any[] = [];
  map.forEach((v, k) => fe.push([k, v]));
  assertEquals(fe, entries);

  map.delete("b");
  entries.splice(1, 1);
  assertEquals([...map], entries);
  assertEquals([...map.entries()], entries);
  assertEquals([...map.keys()], keys());
  assertEquals([...map.values()], values());

  const nums = new SortedMap<string, { value: number }>(
    (a, b) => a.value - b.value,
  );
  nums.set("a", { value: 2 });
  nums.set("b", { value: 1 });
  nums.set("c", { value: 3 });

  assertEquals([...nums.keys()], ["b", "a", "c"]);
  nums.set("a", { value: 0 });
  assertEquals([...nums.keys()], ["a", "b", "c"]);

  nums.get("c")!.value = -1;
  assertEquals([...nums.keys()], ["a", "b", "c"]);
  assertEquals(nums.update("c"), true);
  nums.get("c")!.value = -2;
  assertEquals(nums.update("c"), false);
  assertEquals([...nums.keys()], ["c", "a", "b"]);
});
