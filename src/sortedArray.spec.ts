import Sorted, { SortedArray } from './sortedArray'

test('sorted array', () => {
  const cmp = (a: number, b: number) => a - b

  expect([...new Sorted(cmp, 2, 1, 3)]).toEqual([1, 2, 3])

  {
    const arr = new Sorted(cmp)
    arr.add(2)
    arr.add(1)
    arr.add(3)
    expect([...arr]).toEqual([1, 2, 3])
  }

  const arr = new Sorted<number>(cmp)

  arr.add(2, 1, 3)
  expect([...arr]).toEqual([1, 2, 3])

  expect(arr.indexOf(2)).toBe(1)

  expect(arr instanceof Sorted).toBe(true)

  arr.add(5, 6, 4)
  expect([...arr]).toEqual([1, 2, 3, 4, 5, 6])

  expect(arr.delete(1, 3)).toEqual([2, 4])
  expect([...arr]).toEqual([1, 3, 5, 6])
  expect(arr.delete(3, 0, 2)).toEqual([6, 1, 5])
  expect([...arr]).toEqual([3])
  expect(arr.delete(0)).toEqual([3])
  expect([...arr]).toEqual([])

  arr.add(0, 1, 2, 3, 4)
  arr.delete(0, -1)
  expect([...arr]).toEqual([1, 2, 3])

  // @ts-ignore
  delete arr[1]
  expect([...arr]).toEqual([1, 3])

  expect(arr.length).toEqual(2)
  arr.clear()
  expect([...arr]).toEqual([])
  expect(arr.length).toEqual(0)

  arr.add(1, 2, 3)

  // @ts-expect-error
  arr.find((value: number, index: number, obj: number[]) => false)
  arr.find((value: number, index: number, obj: SortedArray<number>) => false)
  let fArgs: any[] = []
  arr.find((...args) => {
    fArgs = args
  })
  expect(fArgs[0]).toBe(3)
  expect(fArgs[1]).toBe(2)
  expect(fArgs[2]).toBeInstanceOf(Sorted)

  {
    const sliced = arr.slice(1)
    expect([...sliced]).toEqual([2, 3])
    expect(sliced).toBeInstanceOf(Sorted)
  }

  {
    const org = Sorted.from(cmp, arr)
    org.add(3)
    const filtered = org.filter((n, i, a) => n % 2 && a.indexOf(n) === i)
    expect([...filtered]).toEqual([1, 3])
    expect(filtered).toBeInstanceOf(Sorted)
  }

  const valNum: number = arr[0]
  // @ts-expect-error
  const valStr: string = arr[0]
  // @ts-expect-error
  arr[0] = 1
})
