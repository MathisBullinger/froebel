import oneOf from './oneOf'

test('oneOf', () => {
  {
    const unknown: unknown = 2
    expect(oneOf(unknown, 1, 2, 3)).toBe(true)

    if (oneOf(unknown, 1, 2, 3)) {
      const n: number = unknown
    } else {
      // @ts-expect-error
      const n: number = unknown
    }
  }

  {
    const unknown: unknown = 'a'
    expect(oneOf(unknown, 1, 2, 'a', 'b')).toBe(true)
    if (oneOf(unknown, 1, 2, 'a', 'b')) {
      const sOrN: string | number = unknown
    } else {
      // @ts-expect-error
      const sOrN: string | number = unknown
    }
  }

  {
    const unknown: unknown = 'foo'
    if (oneOf(unknown, 'foo', 'bar')) {
      const known: 'foo' | 'bar' = unknown
    }
  }

  {
    const unknown: unknown = 2
    if (oneOf(unknown, 1, 2)) {
      const known: 1 | 2 = unknown
    }
  }

  {
    const unknown: unknown = 1
    if (oneOf(unknown, 1, 2, 'a', 'b')) {
      const known: 1 | 2 | 'a' | 'b' = unknown
    }
  }
})
