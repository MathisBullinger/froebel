import Bimap, { BiMap } from './bimap'
import { UniqueViolationError } from './error'

const testEntries = (map: BiMap<any, any>, entries: any = []) => {
  expect([...(map as any)['data'].entries()]).toEqual(entries)
}

test('construct bimap', () => {
  const entries = [
    ['a', 1],
    ['b', 2],
  ] as const

  testEntries(new Bimap())
  testEntries(new Bimap(entries), entries)
  testEntries(new Bimap(new Map(entries)), entries)
  testEntries(Bimap.from(Object.fromEntries(entries)), entries)
  testEntries(Bimap.from(new Set(['a', 'b']), new Set([1, 2])), entries)

  expect(
    () =>
      new Bimap([
        [1, 2],
        [2, 2],
      ])
  ).toThrow(UniqueViolationError)
  expect(
    () =>
      new Bimap([
        [1, 2],
        [1, 3],
      ])
  ).toThrow(UniqueViolationError)
  expect(
    () =>
      new Bimap<number, number>(
        new Map([
          [1, 2],
          [2, 2],
        ])
      )
  ).toThrow(UniqueViolationError)

  expect(() => Bimap.from(new Set([1, 2]), new Set('a'))).toThrow(TypeError)
  // @ts-expect-error
  expect(() => Bimap.from(new Set(['foo']))).toThrow(TypeError)
})

const makeNumMap = (
  data = [
    [1, 'one'],
    [2, 'two'],
  ] as [number, string][]
) => [new Bimap(data, 'number', 'word'), data] as const

test('iterable', () => {
  const [numbers, lr] = makeNumMap()
  const rl = lr.map(([l, r]) => [r, l])
  const left = lr.map(([l]) => l)
  const right = rl.map(([r]) => r)

  expect([...numbers]).toEqual(lr)
  expect(Object.fromEntries(numbers)).toEqual(Object.fromEntries(lr))

  expect([...numbers.left]).toEqual(lr)
  expect([...numbers.right]).toEqual(rl)

  expect([...numbers.left.keys()]).toEqual(left)
  expect([...numbers.right.keys()]).toEqual(right)

  expect([...numbers.left.values()]).toEqual(right)
  expect([...numbers.right.values()]).toEqual(left)
})

test('alias sides', () => {
  const [numbers, data] = makeNumMap()
  expect([...numbers]).toEqual(data)
  expect([...numbers.number]).toEqual(data)
  expect([...numbers.word.keys()]).toEqual(['one', 'two'])
})

test('reverse', () => {
  const [numbers] = makeNumMap()
  const reversed = numbers.reverse()

  expect([...reversed]).toEqual([...numbers.right])
  expect([...reversed.right]).toEqual([...numbers])
  expect([...reversed.number]).toEqual([...numbers.number])
  expect([...reversed.word]).toEqual([...numbers.word])
})

test('has', () => {
  const [numbers] = makeNumMap()

  expect(numbers.left.has(1)).toBe(true)
  expect(numbers.left.has(3)).toBe(false)
  // @ts-expect-error
  expect(numbers.left.has('a')).toBe(false)

  expect(numbers.right.has('one')).toBe(true)
  expect(numbers.right.has('three')).toBe(false)
  // @ts-expect-error
  expect(numbers.right.has(1)).toBe(false)

  expect('one' in numbers.right).toBe(true)
  expect('three' in numbers.right).toBe(false)
  expect('keys' in numbers.right).toBe(false)

  expect(1 in numbers.left).toBe(false)
  expect('keys' in numbers.left).toBe(false)
})

test('set left', () => {
  const bm = new Bimap<string, string>()
  expect(bm.left.set('a', 'b')).toBe('b')
  expect(Object.fromEntries(bm)).toEqual({ a: 'b' })
  expect(bm.left.set('c', 'd')).toBe('d')
  expect(Object.fromEntries(bm)).toEqual({ a: 'b', c: 'd' })
})

test('set right', () => {
  const bm = new Bimap<string, string>()
  expect(bm.right.set('a', 'b')).toBe('b')
  expect(Object.fromEntries(bm)).toEqual({ b: 'a' })
  expect(bm.right.set('c', 'd')).toBe('d')
  expect(Object.fromEntries(bm)).toEqual({ b: 'a', d: 'c' })
})

test('remap left', () => {
  const bm = new Bimap([
    ['a', 'b'],
    ['foo', 'bar'],
  ])
  expect(bm.left.set('c', 'b')).toBe('b')
  expect(Object.fromEntries(bm)).toEqual({ foo: 'bar', c: 'b' })
})

test('remap right', () => {
  const bm = new Bimap([
    ['a', 'b'],
    ['foo', 'bar'],
  ])
  expect(bm.right.set('c', 'a')).toBe('a')
  expect(Object.fromEntries(bm)).toEqual({ foo: 'bar', a: 'c' })
})

test('assign prop', () => {
  const s2s = new Bimap<string, string>()
  s2s.left.foo = 'bar'
  s2s.left.bar = 'baz'
  s2s.right.foo = 'bar'
  expect(Object.fromEntries(s2s)).toEqual({ foo: 'bar', bar: 'foo' })

  const s2n = new Bimap<string, number>()
  s2n.left.foo = 2
  expect(Object.fromEntries(s2n)).toEqual({ foo: 2 })
  // @ts-expect-error
  s2n.left.foo = 'bar'
  // @ts-expect-error
  s2n.right.foo = 'bar'
})

test('delete left', () => {
  const [bm] = makeNumMap()
  expect(bm.left.delete(1)).toBe(true)
  expect(bm.left.delete(3)).toBe(false)
  expect(Object.fromEntries(bm.right)).toEqual({ two: 2 })
})

test('delete right', () => {
  const [bm] = makeNumMap()
  expect(bm.right.delete('two')).toBe(true)
  expect(bm.right.delete('foo')).toBe(false)
  expect(Object.fromEntries(bm.right)).toEqual({ one: 1 })
})

test('delete op left', () => {
  const bm = new Bimap([
    ['a', 'b'],
    ['c', 'd'],
  ])
  delete bm.left.a
  expect(Object.fromEntries(bm)).toEqual({ c: 'd' })

  // @ts-expect-error
  delete new Bimap<number, string>().left.foo
})

test('delete op right', () => {
  const [bm] = makeNumMap()
  delete bm.right.two
  expect(Object.fromEntries(bm.right)).toEqual({ one: 1 })
})

test('clear', () => {
  {
    const [bm] = makeNumMap()
    expect([...bm.clear()]).toEqual([])
    expect([...bm]).toEqual([])
  }
  {
    const [bm] = makeNumMap()
    expect([...bm.left.clear()]).toEqual([])
    expect([...bm]).toEqual([])
  }
  {
    const [bm] = makeNumMap()
    expect([...bm.right.clear()]).toEqual([])
    expect([...bm]).toEqual([])
  }
})

test('size', () => {
  const bm = new Bimap([[1, 2]])
  expect(bm.size).toBe(1)
  expect(bm.left.size).toBe(1)
  expect(bm.right.size).toBe(1)
  bm.left.set(3, 4)
  expect(bm.size).toBe(2)
  expect(bm.left.size).toBe(2)
  expect(bm.right.size).toBe(2)
})
