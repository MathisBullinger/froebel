import partition from './partition'

test('partition', () => {
  const isStr = (v: unknown): v is string => typeof v === 'string'

  {
    const res: [['a', 'b'], [1, 2]] = partition(
      ['a', 1, 'b', 2] as const,
      isStr
    )
    expect(res[0]).toEqual(['a', 'b'])
    expect(res[1]).toEqual([1, 2])
  }

  {
    const res = partition(['a', 1, 'b', 2], isStr)
    // @ts-expect-error
    const _: [[], []] = partition(['a', 1, 'b', 2], isStr)
  }

  {
    const _: [(string | number)[], (string | number)[]] = partition(
      ['a', 1, 'b', 2],
      v => typeof v === 'string'
    )
  }
})
