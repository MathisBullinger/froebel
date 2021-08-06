import callAll from './callAll'

test('call all', () => {
  const square = jest.fn((n: number) => n ** 2)
  const cube = jest.fn((n: number) => n ** 3)

  expect(callAll([square, cube], 2)).toEqual([4, 8])
  expect(square).toHaveBeenCalledTimes(1)
  expect(cube).toHaveBeenCalledTimes(1)
})
