import select, { none } from './select'

test('select path', () => {
  const obj = {
    a: {
      b: 'c',
    },
    d: 'e',
    f: undefined,
  } as const

  expect(select(obj, 'a')).toEqual({ b: 'c' })
  expect(select(obj, 'a', 'b')).toBe('c')
  expect(select(obj, 'f')).toBe(undefined)
  expect(select(obj, 'z')).toBe(none)
  expect(select(obj, 'a', 'z')).toBe(none)
  expect(select(obj, 'd', 'e')).toBe(none)

  {
    const a_b: 'c' = select(obj, 'a', 'b')
    const a_z: typeof none = select(obj, 'a', 'z')
  }
  {
    // @ts-expect-error
    const a_b2: 'c' = select(obj as unknown, 'a', 'b')
    const a_b1: unknown = select(obj as unknown, 'a', 'b')

    // @ts-expect-error
    const a_z1: typeof none = select(obj as unknown, 'a', 'z')
    const a_z2: unknown = select(obj as unknown, 'a', 'z')
  }
})
