export const NON_ALPHANUM = /[^\da-z]/gi;
export const EVERY_FOUR_CHARS = /(.{4})(?!$)/g;
export const A_CODE_POINT_AT = 65; // 'A'.codePointAt(0);

/**
 * Utility function to check if a variable is a String.
 * @param {unknown} value the variable to check
 * @returns {boolean} true if the passed variable is a String, false otherwise.
 */
export const isString = (value: unknown): value is string =>
  typeof value == 'string' || value instanceof String;
