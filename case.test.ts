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
  assertEquals(c.snake("foo-bar"), "foo_bar");
  assertEquals(c.snake("foo-Bar"), "foo_bar");
});

Deno.test("screaming snake case", () => {
  assertEquals(c.screamingSnake("fooBar"), "FOO_BAR");
});

Deno.test("kebab case", () => {
  assertEquals(c.kebab("fooBar"), "foo-bar");
  assertEquals(c.kebab("FooBar"), "foo-bar");
  assertEquals(c.kebab("fooBarABC0D"), "foo-bar-ABC0D");
  assertEquals(c.kebab("fooBarABC0DfooBar"), "foo-bar-ABC0D-foo-bar");
  assertEquals(c.kebab("fooBarABC0fooBar"), "foo-bar-ABC0-foo-bar");
  assertEquals(c.kebab("foo_Bar"), "foo-bar");
  assertEquals(c.kebab("foo_Bar"), "foo-bar");
  assertEquals(c.kebab("foo-bar"), "foo-bar");
  assertEquals(c.kebab("foo-Bar"), "foo-bar");
});

Deno.test("camel case", () => {
  assertEquals(c.camel("foo_bar"), "fooBar");
  assertEquals(c.camel("foo-bar"), "fooBar");
  assertEquals(c.camel("foo-Bar"), "fooBar");
  assertEquals(c.camel("FooBar"), "fooBar");
  assertEquals(c.camel("__foo_bar__baz__"), "__fooBar_Baz__");
  assertEquals(c.camel("-_foo_bar-_baz_-"), "-_fooBar-Baz_-");
});

Deno.test("pascal case", () => {
  assertEquals(c.pascal("foo_bar"), "FooBar");
});

Deno.test("transform case", () => {
  assertEquals(c.transformCase("foo_bar", "camel"), "fooBar");
  assertEquals(c.transformCase("foo_bar", "pascal"), "FooBar");
  assertEquals(c.transformCase("fooBar", "snake"), "foo_bar");
  assertEquals(c.transformCase("fooBar", "screaming-snake"), "FOO_BAR");
  assertEquals(c.transformCase("fooBar", "kebab"), "foo-bar");
});
