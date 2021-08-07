import bundle, { bundleSync } from './bundle'

test('bundle', async () => {
  const funA = jest.fn((a: number, b: string) => a)
  const funB = jest.fn((a: number, b: string) => b)

  await expect(bundle(funA, funB)(1, 'a')).resolves.toBeUndefined()
  expect(funA).toHaveBeenCalledTimes(1)
  expect(funB).toHaveBeenCalledTimes(1)
  expect(funA).toHaveBeenLastCalledWith(1, 'a')
  expect(funB).toHaveBeenLastCalledWith(1, 'a')

  const err = new Error()
  await expect(
    bundle(
      funA,
      (a, b) => {
        throw err
      },
      funB
    )(0, '')
  ).rejects.toThrow(err)
  expect(funA).toHaveBeenCalledTimes(2)
  expect(funB).toHaveBeenCalledTimes(2)
  expect(funA).toHaveBeenLastCalledWith(0, '')
  expect(funB).toHaveBeenLastCalledWith(0, '')
})

test('bundle sync', () => {
  const funA = jest.fn((a: number, b: string) => a)
  const funB = jest.fn((a: number, b: string) => b)

  expect(bundleSync(funA, funB)(1, 'a')).toBeUndefined()
  expect(funA).toHaveBeenCalledTimes(1)
  expect(funB).toHaveBeenCalledTimes(1)
  expect(funA).toHaveBeenLastCalledWith(1, 'a')
  expect(funB).toHaveBeenLastCalledWith(1, 'a')

  const err = new Error()
  expect(() =>
    bundleSync(
      funA,
      (a, b) => {
        throw err
      },
      funB
    )(0, '')
  ).toThrow(err)
  expect(funA).toHaveBeenCalledTimes(2)
  expect(funB).toHaveBeenCalledTimes(1)
  expect(funA).toHaveBeenLastCalledWith(0, '')
})
