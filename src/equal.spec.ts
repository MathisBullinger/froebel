import equal from './equal'

test('equal', () => {
  expect(equal(1, 1)).toBe(true)
  expect(equal(1, 2)).toBe(false)
  expect(equal(1, '1')).toBe(false)
  expect(equal('1', '1')).toBe(true)

  expect(equal(null, null)).toBe(true)
  expect(equal(null, undefined)).toBe(false)
  expect(equal(null, {})).toBe(false)

  expect(equal([], [])).toBe(true)
  expect(equal([], {})).toBe(false)
  expect(equal([], [1])).toBe(false)
  expect(equal([1], [1])).toBe(true)
  expect(equal([1], [1, 'a'])).toBe(false)
  expect(equal([1, 'a'], [1, 'a'])).toBe(true)
  expect(equal([1, [2, [3, [4, 5], 6]]], [])).toBe(false)
  expect(equal([1, [2, [3, [4, 5], 6]]], [1, [2, [3, [4, 5], 6]]])).toBe(true)

  {
    const obj = {}
    expect(equal(obj, obj)).toBe(true)
    expect(equal(obj, {})).toBe(true)
  }

  expect(equal({ foo: 'bar' }, { foo: 'baz' })).toBe(false)
  expect(equal({ foo: 'bar' }, { foo: 'bar' })).toBe(true)
  expect(equal({ foo: 'bar' }, { foo: 'bar', bar: 'baz' })).toBe(false)
  expect(equal({ a: { b: { c: 'd' }, e: 'f' } }, {})).toBe(false)
  expect(
    equal({ a: { b: { c: 'd' }, e: 'f' } }, { a: { b: { c: 'd' }, e: 'f' } })
  ).toBe(true)
  expect(equal({ a: [{ b: 1 }, { c: [[{ d: ['e'] }]] }] }, { foo: [] })).toBe(
    false
  )
  expect(
    equal(
      { a: [{ b: 1 }, { c: [[{ d: ['e'] }]] }] },
      { a: [{ b: 1 }, { c: [[{ d: ['e'] }]] }] }
    )
  ).toBe(true)

  {
    const fun = () => {}
    expect(equal(fun, fun)).toBe(true)
    expect(equal(fun, () => {})).toBe(false)
  }
})
