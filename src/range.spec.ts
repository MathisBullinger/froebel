import range, { alphaRange, numberRange } from './range'

test('range', () => {
  expect(range(1, 3)).toEqual([1, 2, 3])
  expect(range(1, 3.5)).toEqual([1, 2, 3])
  expect(range(1, 2.5)).toEqual([1, 2])

  expect(range(3, 1)).toEqual([3, 2, 1])
  expect(range(3, 0.5)).toEqual([3, 2, 1])
  expect(range(3, 1.5)).toEqual([3, 2])

  expect(range(0, 1, 0.2)).toEqual([0, 0.2, 0.2 * 2, 0.2 * 3, 0.2 * 4, 0.2 * 5])

  expect(range('a', 'd')).toEqual('abcd'.split(''))
  expect(range('d', 'a')).toEqual('dcba'.split(''))

  expect(() => alphaRange('foo', 'bar')).toThrow(RangeError)
  expect(() => numberRange(1, 2, -1)).toThrow(RangeError)
  expect(() => numberRange(2, 1, 1)).toThrow(RangeError)

  console.log(range('Z', 'W'))
})
