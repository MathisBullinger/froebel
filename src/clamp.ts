/** Clamp `num` between `min` and `max` inclusively. */
const clamp = (min: number, num: number, max: number) => {
  if (min > max) [min, max] = [max, min]
  return Math.max(Math.min(num, max), min)
}

export default clamp
