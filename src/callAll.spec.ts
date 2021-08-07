import callAll from './callAll'

test('call all', () => {
  const square = jest.fn((n: number) => n ** 2)
  const cube = jest.fn((n: number) => n ** 3)

  expect(callAll([square, cube], 2)).toEqual([4, 8])
  expect(square).toHaveBeenCalledTimes(1)
  expect(cube).toHaveBeenCalledTimes(1)

  // @ts-expect-error
  callAll([(n: number) => 0])

  // @ts-expect-error
  callAll([(n: number) => 0], '')

  // @ts-expect-error
  callAll([square, (n: string) => 0], 2)

  // @ts-expect-error
  const str: string[] = callAll([() => 2])

  // @ts-expect-error
  const [a, b] = callAll([() => 2])
})
