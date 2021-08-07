import clamp from './clamp'

test('clamp', () => {
  expect(clamp(0, 2, 1)).toBe(1)
  expect(clamp(-2, -Infinity, 10)).toBe(-2)
  expect(clamp(20, 25, 30)).toBe(25)
  expect(clamp(30, 25, 20)).toBe(25)
  expect(clamp(30, 50, 20)).toBe(30)
})
