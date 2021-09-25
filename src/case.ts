import type { StringCase, SnakeCase, CamelCase } from './types'

/** Upper-case first letter of string. */
export const capitalize = <T extends string>(str: T) =>
  (str[0].toUpperCase() + str.slice(1)) as Capitalize<T>

/** Lower-case first letter of string */
export const uncapitalize = <T extends string>(str: T) =>
  (str[0].toLowerCase() + str.slice(1)) as Uncapitalize<T>

/** Strictly typed `String.toUpperCase()`. */
export const upper = <T extends string>(str: T) =>
  str.toUpperCase() as Uppercase<T>

/** Strictly typed `String.toLowerCase()`. */
export const lower = <T extends string>(str: T) =>
  str.toLowerCase() as Lowercase<T>

/**
 * Transforms a variable name to snake case.
 *
 * Note: The rules for transforming anything to snake case are somewhat vague.
 * So use this only for very simple names where the resulting value is
 * absolutely unambiguous. For more examples of how names are transformed, have
 * a look at the test cases.
 *
 * @example
 * ```
 * snake('fooBar') // 'foo_bar'
 * ```
 */
export const snake = <T extends string>(str: T): SnakeCase<T> =>
  str
    .replace(/(^|_)(\p{Lu})(?!\p{Lu})/gu, (_, a, b) => `${a}${b.toLowerCase()}`)
    .replace(/([^\p{Lu}])(\p{Lu})(?=\p{Lu})/gu, (_, a, b) => `${a}_${b}`)
    .replace(
      /([^\p{Lu}_0-9])(\p{Lu})/gu,
      (_, a, b) => `${a}_${b.toLowerCase()}`
    )
    .replace(/(\p{Lu}[^\p{L}_]*)(\p{Ll})/gu, (_, a, b) => `${a}_${b}`) as any

/**
 * Transforms a variable name to camel case.
 *
 * Note: The rules for transforming anything to camel case are somewhat vague.
 * So use this only for very simple names where the resulting value is
 * absolutely unambiguous. For more examples of how names are transformed, have
 * a look at the test cases.
 *
 * @example
 * ```
 * camel('foo_bar') // 'fooBar'
 * ```
 */
export const camel = <T extends string>(str: T): CamelCase<T> =>
  str
    .replace(/^\p{Lu}/u, v => v.toLowerCase())
    .replace(/([^_]_*)_(\p{L})/gu, (_, a, b) => a + b.toUpperCase()) as any

/**
 * Transform a variable name to `targetCase`
 *
 * @see {@link snake}
 * @see {@link camel}
 */
export const transformCase = <T extends string, C extends StringCase>(
  str: T,
  targetCase: C
): C extends 'snake' ? SnakeCase<T> : never => {
  if (targetCase === 'snake') return snake(str) as any
  if (targetCase === 'camel') return camel(str) as any
  throw Error(`can't convert to ${targetCase} case`)
}
