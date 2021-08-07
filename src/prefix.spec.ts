import prefix from './prefix'

test('prefix', () => {
  const pre1: 'foobar' = prefix('foo', 'bar')
  expect(pre1).toBe('foobar')

  const pre2: 'fooBar' = prefix('foo', 'bar', 'camel')
  expect(pre2).toBe('fooBar')

  const pre3: 'foo_bar' = prefix('foo', 'bar', 'snake')
  expect(pre3).toBe('foo_bar')
})
