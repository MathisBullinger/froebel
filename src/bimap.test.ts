import Bimap, { BiMap } from "./bimap.ts";
import { UniqueViolationError } from "./error.ts";
import { assert, assertEquals, assertThrows } from "testing/asserts.ts";

const testEntries = (map: BiMap<unknown, unknown>, entries: unknown = []) => {
  assertEquals([
    ...(map as unknown as { data: Map<unknown, unknown> })["data"].entries(),
  ], entries);
};

Deno.test("construct bimap", () => {
  const entries = [
    ["a", 1],
    ["b", 2],
  ] as const;

  testEntries(new Bimap());
  testEntries(new Bimap(entries), entries);
  testEntries(new Bimap(new Map(entries)), entries);
  testEntries(Bimap.from(Object.fromEntries(entries)), entries);
  testEntries(Bimap.from(new Set(["a", "b"]), new Set([1, 2])), entries);

  assertThrows(
    () =>
      new Bimap([
        [1, 2],
        [2, 2],
      ]),
    UniqueViolationError,
  );
  assertThrows(
    () =>
      new Bimap([
        [1, 2],
        [1, 3],
      ]),
    UniqueViolationError,
  );
  assertThrows(
    () =>
      new Bimap<number, number>(
        new Map([
          [1, 2],
          [2, 2],
        ]),
      ),
    UniqueViolationError,
  );

  assertThrows(() => Bimap.from(new Set([1, 2]), new Set("a")), TypeError);
  // @ts-expect-error
  assertThrows(() => Bimap.from(new Set(["foo"])), TypeError);
});

const makeNumMap = (
  data = [
    [1, "one"],
    [2, "two"],
  ] as [number, string][],
) => [new Bimap(data, "number", "word"), data] as const;

Deno.test("iterable", () => {
  const [numbers, lr] = makeNumMap();
  const rl = lr.map(([l, r]) => [r, l]);
  const left = lr.map(([l]) => l);
  const right = rl.map(([r]) => r);

  assertEquals([...numbers], lr);
  assertEquals(Object.fromEntries(numbers), Object.fromEntries(lr));

  assertEquals([...numbers.left], lr);
  assertEquals([...numbers.right], rl);

  assertEquals([...numbers.left.keys()], left);
  assertEquals([...numbers.right.keys()], right);

  assertEquals([...numbers.left.values()], right);
  assertEquals([...numbers.right.values()], left);
});

Deno.test("alias sides", () => {
  const [numbers, data] = makeNumMap();
  assertEquals([...numbers], data);
  assertEquals([...numbers.number], data);
  assertEquals([...numbers.word.keys()], ["one", "two"]);
});

Deno.test("reverse", () => {
  const [numbers] = makeNumMap();
  const reversed = numbers.reverse();

  assertEquals([...reversed], [...numbers.right]);
  assertEquals([...reversed.right], [...numbers]);
  assertEquals([...reversed.number], [...numbers.number]);
  assertEquals([...reversed.word], [...numbers.word]);
});

Deno.test("has", () => {
  const [numbers] = makeNumMap();

  assert(numbers.left.has(1));
  assertEquals(numbers.left.has(3), false);
  // @ts-expect-error
  assertEquals(numbers.left.has("a"), false);

  assert(numbers.right.has("one"));
  assertEquals(numbers.right.has("three"), false);
  // @ts-expect-error
  assertEquals(numbers.right.has(1), false);

  assert("one" in numbers.right);
  assertEquals("three" in numbers.right, false);
  assertEquals("keys" in numbers.right, false);

  assertEquals(1 in numbers.left, false);
  assertEquals("keys" in numbers.left, false);
});

Deno.test("set left", () => {
  const bm = new Bimap<string, string>();
  assertEquals(bm.left.set("a", "b"), "b");
  assertEquals(Object.fromEntries(bm), { a: "b" });
  assertEquals(bm.left.set("c", "d"), "d");
  assertEquals(Object.fromEntries(bm), { a: "b", c: "d" });
});

Deno.test("set right", () => {
  const bm = new Bimap<string, string>();
  assertEquals(bm.right.set("a", "b"), "b");
  assertEquals(Object.fromEntries(bm), { b: "a" });
  assertEquals(bm.right.set("c", "d"), "d");
  assertEquals(Object.fromEntries(bm), { b: "a", d: "c" });
});

Deno.test("remap left", () => {
  const bm = new Bimap([
    ["a", "b"],
    ["foo", "bar"],
  ]);
  assertEquals(bm.left.set("c", "b"), "b");
  assertEquals(Object.fromEntries(bm), { foo: "bar", c: "b" });
});

Deno.test("remap right", () => {
  const bm = new Bimap([
    ["a", "b"],
    ["foo", "bar"],
  ]);
  assertEquals(bm.right.set("c", "a"), "a");
  assertEquals(Object.fromEntries(bm), { foo: "bar", a: "c" });
});

Deno.test("assign prop", () => {
  const s2s = new Bimap<string, string>();
  s2s.left.foo = "bar";
  s2s.left.bar = "baz";
  s2s.right.foo = "bar";
  assertEquals(Object.fromEntries(s2s), { foo: "bar", bar: "foo" });

  const s2n = new Bimap<string, number>();
  s2n.left.foo = 2;
  assertEquals(Object.fromEntries(s2n), { foo: 2 });
  // @ts-expect-error
  s2n.left.foo = "bar";
  // @ts-expect-error
  s2n.right.foo = "bar";
});

Deno.test("delete left", () => {
  const [bm] = makeNumMap();
  assert(bm.left.delete(1));
  assertEquals(bm.left.delete(3), false);
  assertEquals(Object.fromEntries(bm.right), { two: 2 });
});

Deno.test("delete right", () => {
  const [bm] = makeNumMap();
  assert(bm.right.delete("two"));
  assertEquals(bm.right.delete("foo"), false);
  assertEquals(Object.fromEntries(bm.right), { one: 1 });
});

Deno.test("delete op left", () => {
  const bm = new Bimap([
    ["a", "b"],
    ["c", "d"],
  ]);
  delete bm.left.a;
  assertEquals(Object.fromEntries(bm), { c: "d" });

  // @ts-expect-error
  delete new Bimap<number, string>().left.foo;
});

Deno.test("delete op right", () => {
  const [bm] = makeNumMap();
  delete bm.right.two;
  assertEquals(Object.fromEntries(bm.right), { one: 1 });
});

Deno.test("clear", () => {
  {
    const [bm] = makeNumMap();
    assertEquals([...bm.clear()], []);
    assertEquals([...bm], []);
  }
  {
    const [bm] = makeNumMap();
    assertEquals([...bm.left.clear()], []);
    assertEquals([...bm], []);
  }
  {
    const [bm] = makeNumMap();
    assertEquals([...bm.right.clear()], []);
    assertEquals([...bm], []);
  }
});

Deno.test("size", () => {
  const bm = new Bimap([[1, 2]]);
  assertEquals(bm.size, 1);
  assertEquals(bm.left.size, 1);
  assertEquals(bm.right.size, 1);
  bm.left.set(3, 4);
  assertEquals(bm.size, 2);
  assertEquals(bm.left.size, 2);
  assertEquals(bm.right.size, 2);
});

Deno.test("nullish assign", () => {
  {
    const map = new Bimap<string, string>();
    assertEquals(map.left.val ??= "foo", "foo");
    assertEquals(map.left.val ??= "bar", "foo");
    assertEquals([...map], [["val", "foo"]]);
  }
  {
    const map = Bimap.alias("a", "b")<string, string>();
    assertEquals(map.b.val ??= "foo", "foo");
    assertEquals(map.b.val ??= "bar", "foo");
    assertEquals(Object.fromEntries(map), { foo: "val" });
  }
});

Deno.test("getOrSet", () => {
  const a = () => {};
  const b = () => {};
  const map = new Bimap([[a, a]]);

  assertEquals(map.left.getOrSet(a, b), a);
  assertEquals(map.left.getOrSet(b, b), b);
  assertEquals(map.left.set(a, b), b);

  assertEquals(map.right.getOrSet(b, b), a);
  assertEquals(
    map.right.getOrSet(() => {}, b),
    b,
  );
});
