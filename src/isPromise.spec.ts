import isPromise, { isNotPromise } from './isPromise'

test('is promise', () => {
  const prom = new Promise(() => {})

  expect(isPromise(2)).toBe(false)
  expect(isPromise('')).toBe(false)
  expect(isPromise(null)).toBe(false)
  expect(isPromise({})).toBe(false)
  expect(isPromise(() => {})).toBe(false)
  expect(isPromise(async () => {})).toBe(false)
  expect(isPromise({ then: '' })).toBe(false)

  expect(isPromise(prom)).toBe(true)
  expect(isPromise((async () => {})())).toBe(true)
  expect(isPromise({ then() {} })).toBe(true)

  expect(isPromise(1)).not.toBe(isNotPromise(1))
  expect(isPromise(prom)).not.toBe(isNotPromise(prom))
})
