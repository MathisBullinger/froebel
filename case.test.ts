import * as c from "./case.ts";
import { assertEquals } from "testing/asserts.ts";

Deno.test("capitalize", () => {
  assertEquals(c.capitalize("foo"), "Foo");

  // @ts-expect-error
  const _wrong: "FOO" = c.capitalize("foo");
});

Deno.test("uncapitalize", () => {
  assertEquals(c.uncapitalize("Foo"), "foo");

  // @ts-expect-error
  const _wrong: "Foo" = c.uncapitalize("Foo");
});

Deno.test("uppercase", () => {
  assertEquals(c.upper("foo"), "FOO");

  // @ts-expect-error
  const _wrong: "foo" = c.upper("foo");
});

Deno.test("lowercase", () => {
  assertEquals(c.lower("FOO"), "foo");

  // @ts-expect-error
  const _wrong: "FOO" = c.lower("FOO");
});

Deno.test("snake case", () => {
  assertEquals(c.snake("fooBar"), "foo_bar");
  assertEquals(c.snake("FooBar"), "foo_bar");
  assertEquals(c.snake("fooBarABC0D"), "foo_bar_ABC0D");
  assertEquals(c.snake("fooBarABC0DfooBar"), "foo_bar_ABC0D_foo_bar");
  assertEquals(c.snake("fooBarABC0fooBar"), "foo_bar_ABC0_foo_bar");
  assertEquals(c.snake("foo_Bar"), "foo_bar");
  assertEquals(c.snake("foo_Bar"), "foo_bar");
});

Deno.test("camel case", () => {
  assertEquals(c.camel("foo_bar"), "fooBar");
  assertEquals(c.camel("FooBar"), "fooBar");
  assertEquals(c.camel("__foo_bar__baz__"), "__fooBar_Baz__");
});
