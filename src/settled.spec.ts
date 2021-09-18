import { isFulfilled, isRejected } from './settled'

test('settled predicate', async () => {
  const proms: Promise<number>[] = [Promise.resolve(1), Promise.reject('foo')]
  const [a, b] = await Promise.allSettled(proms)

  expect([a, b].map(isFulfilled)).toEqual([true, false])
  expect([a, b].map(isRejected)).toEqual([false, true])

  if (isFulfilled(a)) {
    const val: number = a.value
    // @ts-expect-error
    const str: string = a.value
    // @ts-expect-error
    const err = a.reason
  }
  if (isRejected(a)) {
    const err = a.reason
    // @ts-expect-error
    const val = a.value
  }
})
