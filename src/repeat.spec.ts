import repeat from './repeat'

test('repeat', () => {
  const result: number[] = []
  for (const n of repeat(1, 2, 3)) {
    result.push(n)
    if (result.length >= 9) break
  }
  expect(result).toEqual([1, 2, 3, 1, 2, 3, 1, 2, 3])
})
