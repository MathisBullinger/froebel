import type {
  CamelCase,
  KebabCase,
  PascalCase,
  SnakeCase,
  StringCase,
  λ,
} from "./types.ts";

/** Upper-case first letter of string. */
export const capitalize = <T extends string>(str: T) =>
  (str[0].toUpperCase() + str.slice(1)) as Capitalize<T>;

/** Lower-case first letter of string */
export const uncapitalize = <T extends string>(str: T) =>
  (str[0].toLowerCase() + str.slice(1)) as Uncapitalize<T>;

/** Strictly typed `String.toUpperCase()`. */
export const upper = <T extends string>(str: T) =>
  str.toUpperCase() as Uppercase<T>;

/** Strictly typed `String.toLowerCase()`. */
export const lower = <T extends string>(str: T) =>
  str.toLowerCase() as Lowercase<T>;

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
    .replace(/(\p{L})-(?=\p{L})/gu, "$1_")
    .replace(/(^|_)(\p{Lu})(?!\p{Lu})/gu, (_, a, b) => `${a}${b.toLowerCase()}`)
    .replace(/([^\p{Lu}])(\p{Lu})(?=\p{Lu})/gu, (_, a, b) => `${a}_${b}`)
    .replace(
      /([^\p{Lu}_0-9])(\p{Lu})/gu,
      (_, a, b) => `${a}_${b.toLowerCase()}`,
    )
    .replace(/(\p{Lu}[^\p{L}_]*)(\p{Ll})/gu, (_, a, b) => `${a}_${b}`) as any;

/**
 * Transforms a variable name to kebab case.
 *
 * Note: The rules for transforming anything to kebab case are somewhat vague.
 * So use this only for very simple names where the resulting value is
 * absolutely unambiguous. For more examples of how names are transformed, have
 * a look at the test cases.
 *
 * @example
 * ```
 * snake('fooBar') // 'foo-bar'
 * ```
 */
export const kebab = <T extends string>(str: T): KebabCase<T> =>
  str
    .replace(/(\p{L})_(?=\p{L})/gu, "$1-")
    .replace(/(^|-)(\p{Lu})(?!\p{Lu})/gu, (_, a, b) => `${a}${b.toLowerCase()}`)
    .replace(/([^\p{Lu}])(\p{Lu})(?=\p{Lu})/gu, (_, a, b) => `${a}-${b}`)
    .replace(
      /([^\p{Lu}\-0-9])(\p{Lu})/gu,
      (_, a, b) => `${a}-${b.toLowerCase()}`,
    )
    .replace(/(\p{Lu}[^\p{L}\-]*)(\p{Ll})/gu, (_, a, b) => `${a}-${b}`) as any;

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
    .replace(/^\p{Lu}/u, (v) => v.toLowerCase())
    .replace(
      /([^_-][_-]*)[_-](\p{L})/gu,
      (_, a, b) => a + b.toUpperCase(),
    ) as any;

/**
 * Transforms a variable name to pascal case.
 *
 * Note: The rules for transforming anything to pascal case are somewhat vague.
 * So use this only for very simple names where the resulting value is
 * absolutely unambiguous. For more examples of how names are transformed, have
 * a look at the test cases.
 *
 * @example
 * ```
 * camel('foo_bar') // 'FooBar'
 * ```
 */
export const pascal = <T extends string>(str: T): PascalCase<T> =>
  capitalize(camel(str));

/**
 * Transform a variable name to `targetCase`
 *
 * @see {@link snake}
 * @see {@link kebab}
 * @see {@link camel}
 */
export const transformCase = <T extends string, C extends StringCase>(
  str: T,
  targetCase: C,
): C extends "snake" ? SnakeCase<T> : never => {
  if (!(targetCase in converters)) {
    throw Error(`can't convert to ${targetCase} case`);
  }
  return converters[targetCase](str) as any;
};

const converters: Record<StringCase, λ<[string], string>> = {
  camel,
  kebab,
  pascal,
  snake,
};
