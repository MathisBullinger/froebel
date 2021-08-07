import * as c from './case'

test('capitalize', () => {
  expect(c.capitalize('foo')).toBe('Foo')

  // @ts-expect-error
  const wrong: 'FOO' = c.capitalize('foo')
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
