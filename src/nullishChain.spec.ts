import { nullishChain } from './nullishChain'

test('nullish chain', () => {
  const numChain = nullishChain(
    (n: number) => (n === 1 ? n : null),
    n => (n === 2 ? n : undefined),
    n => (n === 3 ? n : null)
  )

  expect(numChain(1)).toBe(1)
  expect(numChain(2)).toBe(2)
  expect(numChain(3)).toBe(3)
  expect(numChain(4)).toBe(undefined)

  // @ts-expect-error
  // prettier-ignore
  nullishChain((n: number) => 0, (n: string) => 0)

  // @ts-expect-error
  const str: string = nullishChain(() => 2)()

  const empty = nullishChain()
})
