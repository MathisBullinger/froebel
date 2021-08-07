import atWrap from './atWrap'

test('atWrap', () => {
  const list = [0, 1, 2]

  expect(atWrap(list, 0)).toBe(0)
  expect(atWrap(list, 1)).toBe(1)
  expect(atWrap(list, 2)).toBe(2)
  expect(atWrap(list, 3)).toBe(0)
  expect(atWrap(list, 4)).toBe(1)
  expect(atWrap(list, 13)).toBe(1)

  expect(atWrap(list, -1)).toBe(2)
  expect(atWrap(list, -2)).toBe(1)
  expect(atWrap(list, -3)).toBe(0)
  expect(atWrap(list, -4)).toBe(2)
  expect(atWrap(list, -5)).toBe(1)
  expect(atWrap(list, -14)).toBe(1)
})
