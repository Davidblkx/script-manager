// deno-lint-ignore-file ban-types

/**
 * Check if a value is an object of type T
 *
 * @param e value to validate
 * @returns True if value is an object of type T
 */
export function isObject<T extends {}>(e: unknown): e is T {
  return typeof e === 'object' && e !== null;
}

/**
 * Check if value is not undefined or null
 *
 * @param e value to validate
 * @returns True if value is not undefined or null
 */
export function isValue<T>(e: unknown): e is T {
  return typeof e !== 'undefined' && e !== null;
}
