import oneOf from './oneOf'

test('oneOf', () => {
  let foo: unknown = 2
  expect(oneOf(foo, 1, 2, 3)).toBe(true)

  if (oneOf(foo, 1, 2, 3)) {
    const n: number = foo
  } else {
    // @ts-expect-error
    const n: number = foo
  }

  const bar = 'a' as unknown
  expect(oneOf(bar, 1, 2, 'a', 'b')).toBe(true)
  if (oneOf(bar, 1, 2, 'a', 'b')) {
    const sOrN: string | number = bar
  } else {
    // @ts-expect-error
    const sOrN: string | number = bar
  }
})
