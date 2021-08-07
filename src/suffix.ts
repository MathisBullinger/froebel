import type { StringCase, Suffix } from './types'
import prefix from './prefix'

/**
 * Returns `str` suffixed with `suffix`. Same case and type behavior as
 * {@link prefix}.
 */
const suffix = <
  T0 extends string,
  T1 extends string,
  C extends StringCase | void = void
>(
  str: T1,
  suffix: T0,
  caseMod?: C
): Suffix<T1, T0, C> => prefix(str, suffix, caseMod)

export default suffix
