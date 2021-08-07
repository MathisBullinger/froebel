import suffix from './suffix'

test('suffix', () => {
  const suf1: 'foobar' = suffix('foo', 'bar')
  expect(suf1).toBe('foobar')

  const suf2: 'fooBar' = suffix('foo', 'bar', 'camel')
  expect(suf2).toBe('fooBar')

  const suf3: 'foo_bar' = suffix('foo', 'bar', 'snake')
  expect(suf3).toBe('foo_bar')
})
