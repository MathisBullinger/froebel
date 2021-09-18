import { falsy, truthy } from './truthy'

test('truthy & falsy', () => {
  type Num = 0 | 1 | 2

  {
    const num: Num = 2 as any

    expect(truthy(num)).toBe(true)
    expect(falsy(num)).toBe(false)

    if (truthy(num)) {
      // @ts-expect-error
      const nf: 0 = num
      const nt: 1 | 2 = num
    } else {
      const nf: 0 = num
      // @ts-expect-error
      const nt: 1 | 2 = num
    }

    if (falsy(num)) {
      const nf: 0 = num
      // @ts-expect-error
      const nt: 1 | 2 = num
    } else {
      // @ts-expect-error
      const nf: 0 = num
      const nt: 1 | 2 = num
    }
  }
})
