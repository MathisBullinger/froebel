import equal from "./equal.ts";
import { assert, assertEquals } from "testing/asserts.ts";

Deno.test("equal", () => {
  assert(equal(1, 1));
  assertEquals(equal(1, 2), false);
  assertEquals(equal(1, "1"), false);
  assert(equal("1", "1"));

  assert(equal(null, null));
  assertEquals(equal(null, undefined), false);
  assertEquals(equal(null, {}), false);

  assert(equal([], []));
  assertEquals(equal([], {}), false);
  assertEquals(equal([], [1]), false);
  assert(equal([1], [1]));
  assertEquals(equal([1], [1, "a"]), false);
  assert(equal([1, "a"], [1, "a"]));
  assertEquals(equal([1, [2, [3, [4, 5], 6]]], []), false);
  assert(equal([1, [2, [3, [4, 5], 6]]], [1, [2, [3, [4, 5], 6]]]));

  {
    const obj = {};
    assert(equal(obj, obj));
    assert(equal(obj, {}));
  }

  assertEquals(equal({ foo: "bar" }, { foo: "baz" }), false);
  assert(equal({ foo: "bar" }, { foo: "bar" }));
  assertEquals(equal({ foo: "bar" }, { foo: "bar", bar: "baz" }), false);
  assertEquals(equal({ a: { b: { c: "d" }, e: "f" } }, {}), false);
  assertEquals(
    equal({ a: { b: { c: "d" }, e: "f" } }, { a: { b: { c: "d" }, e: "f" } }),
    true,
  );
  assertEquals(
    equal({ a: [{ b: 1 }, { c: [[{ d: ["e"] }]] }] }, { foo: [] }),
    false,
  );
  assertEquals(
    equal(
      { a: [{ b: 1 }, { c: [[{ d: ["e"] }]] }] },
      { a: [{ b: 1 }, { c: [[{ d: ["e"] }]] }] },
    ),
    true,
  );

  {
    const fun = () => {};
    assert(equal(fun, fun));
    assertEquals(
      equal(fun, () => {}),
      false,
    );
  }
});
