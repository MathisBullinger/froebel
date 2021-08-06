import isPromise from './isPromise'

test('is promise', () => {
  expect(isPromise(2)).toBe(false)
  expect(isPromise('')).toBe(false)
  expect(isPromise(null)).toBe(false)
  expect(isPromise({})).toBe(false)
  expect(isPromise(() => {})).toBe(false)
  expect(isPromise(async () => {})).toBe(false)
  expect(isPromise({ then: '' })).toBe(false)

  expect(isPromise(new Promise(() => {}))).toBe(true)
  expect(isPromise((async () => {})())).toBe(true)
  expect(isPromise({ then() {} })).toBe(true)
})
