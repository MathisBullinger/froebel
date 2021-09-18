import pick from './pick'

test('pick', () => {
  const obj = { a: 'foo', b: 'bar', c: 'baz' }

  const foo = pick(obj, 'a', 'b')
  expect(foo).toEqual({ a: 'foo', b: 'bar' })

  const a: string = foo.a
  const b: string = foo.b
  // @ts-expect-error
  const c = foo.c
})
