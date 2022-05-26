import { assert } from './internal/except'

/**
 * Takes a `list` and returns it in multiple smaller lists of the size
 * `batchSize`.
 * The last batch may be smaller than `batchSize` depending on if `list` size is
 * divisible by `batchSize`.
 *
 * @example
 * ```
 * batch([1,2,3,4,5], 2)  // -> [ [1,2], [3,4], [5] ]
 * ```
 */
const batch = <T>(list: T[], batchSize: number): T[][] => {
  assert(
    typeof batchSize === 'number' && !Number.isNaN(batchSize) && batchSize > 0,
    'batch size must be > 0',
    RangeError
  )

  const size = Number.isFinite(batchSize) ? batchSize : list.length

  return [...Array(Math.ceil(list.length / size))].map((_, i) =>
    list.slice(i * size, (i + 1) * size)
  )
}

export default batch
