/**
 * Shuffles `list` using the Fisher-Yates shuffle algorithm.
 * The original `list` is not modified and the shuffled list is returned.
 */
const shuffle = <T>(list: T[]): T[] => {
  const shuffled = [...list];
  shuffleInPlace(shuffled);
  return shuffled;
};

export default shuffle;

/**
 * Same as {@link shuffle} but shuffles `list` in place.
 */
export const shuffleInPlace = (list: unknown[]): void => {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = list[j];
    list[j] = list[i];
    list[i] = tmp;
  }
};
