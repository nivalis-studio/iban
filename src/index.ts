import { COUNTRIES } from './countries';
import { EVERY_FOUR_CHARS, NON_ALPHANUM, isString } from './utils';
import type { Specification } from './specification';

export const getCountry = (countryCode: string): Specification => {
  const countryStructure = COUNTRIES[countryCode];

  if (!countryStructure) {
    throw new Error(`No country with code ${countryCode}`);
  }

  return countryStructure;
};

export const electronicFormat = (iban: string): string =>
  iban.replaceAll(NON_ALPHANUM, '').toUpperCase();

/**
 * Check if an IBAN is valid. Does not throw an error if the IBAN is invalid.
 * @param {string} iban the IBAN to validate.
 * @returns {boolean} true if the passed IBAN is valid, false otherwise
 */
export const isValid = (iban: string): boolean => {
  if (!isString(iban)) return false;

  const ibanFormatted = electronicFormat(iban);

  try {
    const countryStructure = getCountry(ibanFormatted.slice(0, 2));

    return countryStructure.isValid(ibanFormatted);
  } catch {
    return false;
  }
};

/**
 * Convert an IBAN to a BBAN. Throws an error if the passed IBAN is invalid.
 * @param {string} iban the IBAN to convert
 * @param {string} [separator] the separator to use between the blocks of the BBAN, defaults to ' '
 * @returns {string} the BBAN
 */
export const toBBAN = (iban: string, separator: string = ' '): string => {
  const ibanFormatted = electronicFormat(iban);

  return getCountry(ibanFormatted.slice(0, 2)).toBBAN(ibanFormatted, separator);
};

/**
 * Convert the passed BBAN to an IBAN for this country specification.
 * Please note that <i>"generation of the IBAN shall be the exclusive responsibility of the bank/branch servicing the account"</i>.
 * This method implements the preferred algorithm described in http://en.wikipedia.org/wiki/International_Bank_Account_Number#Generating_IBAN_check_digits
 * @param {string} countryCode the country of the BBAN
 * @param {string} bban the BBAN to convert to IBAN
 * @returns {string} the IBAN
 */
export const fromBBAN = (countryCode: string, bban: string): string =>
  getCountry(countryCode).fromBBAN(electronicFormat(bban));

/**
 * Check the validity of the passed BBAN.
 * @param {string} countryCode the country of the BBAN
 * @param {string} bban the BBAN to check the validity of
 * @returns {boolean} true if the passed BBAN is valid, false otherwise
 */
export const isValidBBAN = (countryCode: string, bban: string): boolean => {
  if (!isString(bban)) return false;

  return getCountry(countryCode).isValidBBAN(electronicFormat(bban));
};

/**
 * Format the passed IBAN to a printable format.
 * @param {string} iban the IBAN to format
 * @param {string} [separator] the separator to use between the blocks of the BBAN, defaults to ' '
 * @returns {string} the formatted IBAN
 */
export const printFormat = (iban: string, separator: string = ' '): string =>
  electronicFormat(iban).replaceAll(EVERY_FOUR_CHARS, `$1${separator}`);

export const availableCountries = (): { [key: string]: Specification } =>
  COUNTRIES;
