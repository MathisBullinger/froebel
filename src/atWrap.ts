/** Access list at `i % length`. Negative indexes start indexing the last
 * element as `[-1]` and wrap around to the back. */
const atWrap = <T>(arr: T[], i: number): T =>
  arr[i >= 0 ? i % arr.length : arr.length + (i % arr.length || -arr.length)];

export default atWrap;
