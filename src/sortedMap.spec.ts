import SortedMap from './sortedMap'

test('SortedMap', () => {
  let entries: [string, string][] = [
    ['a', 'foo'],
    ['b', 'bar'],
    ['c', 'baz'],
  ]
  const keys = () => entries.map(([k]) => k)
  const values = () => entries.map(([, v]) => v)

  expect([
    ...new SortedMap(
      (va, vb, a, b) => a.localeCompare(b),
      [entries[1], entries[0], entries[2]]
    ),
  ]).toEqual(entries)

  const map = new SortedMap<string, string>((va, vb, a, b) =>
    a.localeCompare(b)
  )

  map.set(...entries[1])
  map.set(...entries[0])
  map.set(...entries[2])

  expect([...map]).toEqual(entries)
  expect([...map.entries()]).toEqual(entries)
  expect([...map.keys()]).toEqual(keys())
  expect([...map.values()]).toEqual(values())
  expect(map.map(v => v)).toEqual(values())
  expect(map.map((_, k) => k)).toEqual(keys())

  const fe: any[] = []
  map.forEach((v, k) => fe.push([k, v]))
  expect(fe).toEqual(entries)

  map.delete('b')
  entries.splice(1, 1)
  expect([...map]).toEqual(entries)
  expect([...map.entries()]).toEqual(entries)
  expect([...map.keys()]).toEqual(keys())
  expect([...map.values()]).toEqual(values())

  const nums = new SortedMap<string, { value: number }>(
    (a, b) => a.value - b.value
  )
  nums.set('a', { value: 2 })
  nums.set('b', { value: 1 })
  nums.set('c', { value: 3 })

  expect([...nums.keys()]).toEqual(['b', 'a', 'c'])
  nums.set('a', { value: 0 })
  expect([...nums.keys()]).toEqual(['a', 'b', 'c'])

  nums.get('c')!.value = -1
  expect([...nums.keys()]).toEqual(['a', 'b', 'c'])
  expect(nums.update('c')).toBe(true)
  nums.get('c')!.value = -2
  expect(nums.update('c')).toBe(false)
  expect([...nums.keys()]).toEqual(['c', 'a', 'b'])
})
