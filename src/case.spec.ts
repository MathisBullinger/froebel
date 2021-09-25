import * as c from './case'

test('capitalize', () => {
  expect(c.capitalize('foo')).toBe('Foo')

  // @ts-expect-error
  const wrong: 'FOO' = c.capitalize('foo')
})

test('uncapitalize', () => {
  expect(c.uncapitalize('Foo')).toBe('foo')

  // @ts-expect-error
  const wrong: 'Foo' = c.uncapitalize('Foo')
})

test('uppercase', () => {
  expect(c.upper('foo')).toBe('FOO')

  // @ts-expect-error
  const wrong: 'foo' = c.upper('foo')
})

test('lowercase', () => {
  expect(c.lower('FOO')).toBe('foo')

  // @ts-expect-error
  const wrong: 'FOO' = c.lower('FOO')
})

test('snake case', () => {
  expect(c.snake('fooBar')).toBe('foo_bar')
  expect(c.snake('FooBar')).toBe('foo_bar')
  expect(c.snake('fooBarABC0D')).toBe('foo_bar_ABC0D')
  expect(c.snake('fooBarABC0DfooBar')).toBe('foo_bar_ABC0D_foo_bar')
  expect(c.snake('fooBarABC0fooBar')).toBe('foo_bar_ABC0_foo_bar')
  expect(c.snake('foo_Bar')).toBe('foo_bar')
  expect(c.snake('foo_Bar')).toBe('foo_bar')
})

test('camel case', () => {
  expect(c.camel('foo_bar')).toBe('fooBar')
  expect(c.camel('FooBar')).toBe('fooBar')
  expect(c.camel('__foo_bar__baz__')).toBe('__fooBar_Baz__')
})
