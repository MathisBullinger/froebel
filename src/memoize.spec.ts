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

  const effect = jest.fn((n: number) => n)
  const eff = memoize(effect, { key: n => n, limit: 1 })

  expect(eff(1)).toBe(1)
  expect(effect).toHaveBeenCalledTimes(1)
  expect(eff(1)).toBe(1)
  expect(effect).toHaveBeenCalledTimes(1)
  expect(eff(2)).toBe(2)
  expect(effect).toHaveBeenCalledTimes(2)
  expect(eff(2)).toBe(2)
  expect(effect).toHaveBeenCalledTimes(2)
  expect(eff(1)).toBe(1)
  expect(effect).toHaveBeenCalledTimes(3)
  expect(eff(2)).toBe(2)
  expect(effect).toHaveBeenCalledTimes(4)
  expect(eff(1)).toBe(1)
  expect(effect).toHaveBeenCalledTimes(5)
  expect(eff(1)).toBe(1)
  expect(effect).toHaveBeenCalledTimes(5)

  const mem = memoize((el: HTMLElement) => el.getBoundingClientRect(), {
    key: n => n,
    weak: true,
  })
  {
    // @ts-expect-error
    const cache: Map<any, any> = mem.cache
  }
  {
    const cache: Map<any, any> = memRoot.cache
  }

  expect(() =>
    memoize((el: HTMLElement) => el.getBoundingClientRect(), {
      key: n => n,
      weak: true,
      limit: 1,
    })
  ).toThrow()
})
