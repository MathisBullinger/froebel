import omit from './omit'

test('omit', () => {
  const obj = { a: 'foo', b: 'bar', c: 'baz' }

  const foo = omit(obj, 'b', 'c')
  expect(foo).toEqual({ a: 'foo' })

  const a: string = foo.a
  // @ts-expect-error
  const b = foo.b
  // @ts-expect-error
  const c = foo.c
})
