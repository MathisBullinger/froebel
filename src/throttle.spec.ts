import throttle from './throttle'
import { performance } from 'perf_hooks'
import { λ } from './types'

// the built-in setInterval is to imprecise for the purpose of this test
const intervalIds: Record<number, any> = {}
const setInterval = (cb: λ, ms: number): number => {
  const id = Object.keys(intervalIds).length

  let last = performance.now()
  let span = ms

  const step = () => {
    const now = performance.now()
    if (now - last >= span) {
      span = ms - (now - last - ms)
      last = now
      cb()
    }
    intervalIds[id] = setImmediate(step)
  }
  intervalIds[id] = setImmediate(step)
  return id
}
const clearInterval = (id: number) => {
  clearImmediate(intervalIds[id])
}

const expectTimes = (times: number[], ...expected: number[]) => {
  expect(times.length).toBe(expected.length)
  const margin = 5
  for (let i = 0; i < times.length; i++) {
    expect(times[i]).toBeGreaterThan(expected[i] - margin)
    expect(times[i]).toBeLessThan(expected[i] + margin)
  }
}

const runTest = (
  interval: number,
  {
    leading = false,
    trailing = false,
  }: {
    leading?: boolean
    trailing?: boolean
  },
  ...expected: number[]
) =>
  new Promise<void>(done => {
    const t0 = performance.now()
    const invocations: number[] = []

    const fun = () => {
      invocations.push(performance.now() - t0)
    }

    const throttled = throttle(fun, 50, { leading, trailing })

    const iid = setInterval(throttled, interval)

    setTimeout(() => {
      clearInterval(iid)
      setTimeout(() => {
        try {
          expectTimes(invocations, ...expected)
        } finally {
          done()
        }
      }, 100)
    }, 150)
  })

test('throttle (leading + trailing)', () =>
  runTest(10, { leading: true, trailing: true }, 10, 60, 110, 160))

test('throttle (trailing)', () =>
  runTest(10, { leading: false, trailing: true }, 60, 110, 160))

test('throttle (leading)', () =>
  runTest(16, { leading: true, trailing: false }, 16, 80, 144))
