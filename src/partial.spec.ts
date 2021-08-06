import partial from './partial'

test('partial application', () => {
  const fun = (a: string, b: number, c: boolean) => JSON.stringify([a, b, c])

  const funABC = partial(fun)
  const funBC = partial(fun, 'a')
  const funC = partial(fun, 'b', 2)
  const fun_ = partial(fun, 'c', 3, true)

  expect(funABC('_', 0, false)).toBe(JSON.stringify(['_', 0, false]))
  expect(funBC(1, true)).toBe(JSON.stringify(['a', 1, true]))
  expect(funC(false)).toBe(JSON.stringify(['b', 2, false]))
  expect(fun_()).toBe(JSON.stringify(['c', 3, true]))
})
