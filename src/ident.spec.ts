import ident from './ident'

test('identity function', () => {
  expect(ident(1)).toBe(1)
  let obj = {}
  expect(ident(obj)).toBe(obj)
})
