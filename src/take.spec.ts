import { takeList as take } from './take'
import repeat from './repeat'

test('take', () => {
  {
    let i = 0
    const iter: IterableIterator<number> = {
      next: () => ({
        value: i++,
      }),
      [Symbol.iterator]() {
        return this
      },
    }

    expect(take(5, iter)).toEqual([0, 1, 2, 3, 4])
  }

  expect(take(5, repeat(1, 2))).toEqual([1, 2, 1, 2, 1])

  {
    let i = 0
    const iter = {
      next: () => (++i <= 3 ? { value: i - 1 } : { done: true }),
      [Symbol.iterator]() {
        return this
      },
    }

    const list = take(5, iter as any)
    expect(list).toEqual([0, 1, 2])
    expect(list.length).toBe(3)
  }

  expect(take(5, [1, 2, 3, 4, 5, 6])).toEqual([1, 2, 3, 4, 5])
  expect(take(5, [1, 2, 3])).toEqual([1, 2, 3])
  expect(take(5, [1, 2, 3]).length).toBe(3)
})
