/** Clamp `number` between `min` and `max` inclusively. */
const clamp = (min: number, number: number, max: number) => {
  if (min > max) [min, max] = [max, min]
  return Math.max(Math.min(number, max), min)
}

export default clamp
