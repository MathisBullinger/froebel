import zip, { zipWith } from './zip'

test('zip', () => {
  {
    const pairs: [number, string][] = zip([1, 2, 3], ['a', 'b', 'c'])
    expect(pairs).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ])
  }

  expect(zip([1], ['a', 'b'])).toEqual([[1, 'a']])

  expect(zip([1, 2, 3], [true, false, true], ['a', 'b', 'c'])).toEqual([
    [1, true, 'a'],
    [2, false, 'b'],
    [3, true, 'c'],
  ])

  expect(zip([1, 2, 3])).toEqual([[1], [2], [3]])
})

test('zipWith', () => {
  const sums: number[] = zipWith((a, b) => a + b, [1, 2, 3], [4, 5, 6])
  expect(sums).toEqual([5, 7, 9])

  // @ts-expect-error
  zipWith((n: string) => n, [1])
})
