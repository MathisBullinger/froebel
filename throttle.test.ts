import throttle from "./throttle.ts";
import { assert, assertEquals } from "testing/asserts.ts";

const expectTimes = (times: number[], ...expected: number[]) => {
  assertEquals(times.length, expected.length);
  const margin = 32;
  for (let i = 0; i < times.length; i++) {
    assert(times[i] > expected[i] - margin);
    assert(times[i] < expected[i] + margin);
  }
};

const runTest = (
  interval: number,
  {
    leading = false,
    trailing = false,
  }: {
    leading?: boolean;
    trailing?: boolean;
  },
  ...expected: number[]
) =>
  new Promise<void>((done) => {
    const t0 = performance.now();
    const invocations: number[] = [];

    const fun = () => {
      invocations.push(performance.now() - t0);
    };

    const throttled = throttle(fun, 50, { leading, trailing });

    const iid = setInterval(throttled, interval);

    setTimeout(() => {
      clearInterval(iid);
      setTimeout(() => {
        try {
          expectTimes(invocations, ...expected);
        } finally {
          done();
        }
      }, 100);
    }, 150);
  });

Deno.test("throttle (leading + trailing)", () =>
  runTest(10, { leading: true, trailing: true }, 10, 60, 110, 160));

Deno.test("throttle (trailing)", () =>
  runTest(10, { leading: false, trailing: true }, 60, 110, 160));

Deno.test("throttle (leading)", () =>
  runTest(16, { leading: true, trailing: false }, 16, 80, 144));
