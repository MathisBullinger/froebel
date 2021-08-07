import memoize from './memoize'

test('memoize', () => {
  const root = jest.fn((n: number) => Math.sqrt(n))

  const memRoot = memoize(root)

  expect(memRoot(9)).toBe(3)
  expect(root).toHaveBeenCalledTimes(1)

  expect(memRoot(9)).toBe(3)
  expect(root).toHaveBeenCalledTimes(1)

  expect(memRoot(16)).toBe(4)
  expect(root).toHaveBeenCalledTimes(2)

  expect(memRoot(16)).toBe(4)
  expect(root).toHaveBeenCalledTimes(2)

  memRoot.cache.clear()
  expect(memRoot(9)).toBe(3)
  expect(root).toHaveBeenCalledTimes(3)

  expect(memRoot(9)).toBe(3)
  expect(root).toHaveBeenCalledTimes(3)
})
