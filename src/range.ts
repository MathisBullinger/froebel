import { assert } from './internal/except'

/**
 * Constructs a numeric between `start` and `end` inclusively.
 *
 * @param step - The step between items of the list. Must be `> 0` for ascending
 * and `< 0` for descending ranges. Defaults to `1` if ascending and `-1` if
 * descending.
 *
 * @example
 * ```
 * range(2, 6)      // -> [2, 3, 4, 5, 6]
 * range(8, 9, .3)  // -> [8, 8.3, 8.6, 8.9]
 * range(3, -2)     // -> [3, 2, 1, 0, -1, -2]
 * ```
 */
export function numberRange(
  start: number,
  end: number,
  step = end > start ? 1 : -1
): number[] {
  assert(
    Math.sign(step) === Math.sign(end - start),
    'step must be >0 for ascending and <0 descending ranges',
    RangeError
  )
  const sequence: number[] = []
  for (let n = start; step > 0 ? n <= end : n >= end; n += step)
    sequence.push(n)
  return sequence
}

/**
 * Constructs a range between characters.
 *
 * @example
 * ```
 * range('a', 'd')  // -> ['a', 'b', 'c', 'd']
 * range('Z', 'W')  // -> ['Z', 'Y', 'X', 'W']
 * ```
 */
export function alphaRange(start: string, end: string) {
  assert(
    start.length === 1 && end.length === 1,
    'alphabetical range can only be constructed between single-character strings',
    RangeError
  )

  return numberRange(start.charCodeAt(0), end.charCodeAt(0)).map(n =>
    String.fromCharCode(n)
  )
}

type RangeSig = {
  (...args: Parameters<typeof numberRange>): ReturnType<typeof numberRange>
  (...args: Parameters<typeof alphaRange>): ReturnType<typeof alphaRange>
}

/**
 * Creates a range between two values.
 *
 * @see {@link numberRange}
 * @see {@link alphaRange}
 */
const range: RangeSig = (...args: unknown[]) =>
  ((typeof args[0] === 'number' ? numberRange : alphaRange) as any)(...args)

export default range
