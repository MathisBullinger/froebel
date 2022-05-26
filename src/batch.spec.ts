import batch from './batch'

test('batch', () => {
  expect(batch([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  expect(batch([1, 2, 3, 4, 5], 6)).toEqual([[1, 2, 3, 4, 5]])
  expect(batch([1, 2, 3, 4], 2)).toEqual([
    [1, 2],
    [3, 4],
  ])
  expect(batch([], 5)).toEqual([])
  expect(batch([1, 2], Infinity)).toEqual([[1, 2]])
  expect(() => batch([1, 2], 0)).toThrow(RangeError)
  expect(() => batch([1, 2], -1)).toThrow(RangeError)
  expect(() => batch([1, 2], NaN)).toThrow(RangeError)
})
