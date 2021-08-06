import forward from './forward'

test('forward arguments', () => {
  const fun = (a: string, b: number, c: boolean) => JSON.stringify([a, b, c])

  const funA = forward(fun, 1, true)
  expect(funA('a')).toBe(JSON.stringify(['a', 1, true]))

  const funAB = forward(fun, false)
  expect(funAB('b', 2)).toBe(JSON.stringify(['b', 2, false]))
})
