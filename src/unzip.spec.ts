import unzip, { unzipWith } from './unzip'

test('unzip', () => {
  {
    const unzipped: [number[], string[]] = unzip([1, 'a'], [2, 'b'], [3, 'c'])
    expect(unzipped).toEqual([
      [1, 2, 3],
      ['a', 'b', 'c'],
    ])
  }

  {
    const unzipped = unzip([1, true, 'a'], [2, false, 'b'], [3, true, 'c'])
    expect(unzipped).toEqual([
      [1, 2, 3],
      [true, false, true],
      ['a', 'b', 'c'],
    ])
  }

  // @ts-expect-error
  unzip([1, 'a'], [2])
})

test('unzipWith', () => {
  const [nums, str]: [number[], string] = unzipWith(
    [
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ],
    (n, a: number[] = []) => [...a, n],
    (c, str = '') => str + c
  )

  expect(nums).toEqual([1, 2, 3])
  expect(str).toEqual('abc')
})
