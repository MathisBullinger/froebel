import { once, limitInvocations } from './invoke'

test('once', () => {
  once(() => {})
  once(
    () => {},
    // @ts-expect-error
    arg => {}
  )
  once(
    () => {},
    () => {}
  )
  // @ts-expect-error
  once(() => 0)
  once(
    () => 0,
    () => 0
  )
  once(
    () => 0,
    // @ts-expect-error
    () => ''
  )
  once(
    () => 0,
    // @ts-expect-error
    async () => 0
  )

  once(async () => {})
  // @ts-expect-error
  once(async () => 0)
  once(
    async () => 0,
    async () => 0
  )
  once(
    async () => 0,
    () => 0
  )

  // @ts-expect-error
  once((n: number) => {})()
  once((n: number) => {})(1)
  // @ts-expect-error
  once((n: number) => {})(1, 2)
  // @ts-expect-error
  once((a: number, b: strin) => {})(1)
  once((a: number, b: string) => {})(1, 'a')

  const rn: number = once(
    () => 1,
    () => 2
  )()
  // @ts-expect-error
  const rs: string = once(
    () => 1,
    () => 2
  )()

  {
    const f = once(
      () => 1,
      () => 2
    )
    expect(f()).toEqual(1)
    expect(f()).toEqual(2)
    expect(f()).toEqual(2)
  }
})

test('limit', () => {
  const f = limitInvocations(
    () => 'a',
    2,
    () => 'b'
  )
  expect(f()).toEqual('a')
  expect(f()).toEqual('a')
  expect(f()).toEqual('b')

  const f3 = limitInvocations(
    () => 0,
    3,
    () => {
      throw '4th invoke'
    }
  )
  expect(f3()).toEqual(0)
  expect(f3()).toEqual(0)
  expect(f3()).toEqual(0)
  expect(() => f3()).toThrow('4th invoke')
})
