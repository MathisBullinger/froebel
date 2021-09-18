/** Checks if `value` is nullish. Literal types are narrowed accordingly. */
export const nullish = <T>(
  value: T | null | undefined
): value is null | undefined => value === undefined || value === null

/** Checks if `value` is not nullish. Literal types are narrowed accordingly. */
export const notNullish = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined
