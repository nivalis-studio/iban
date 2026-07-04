import { COUNTRIES, COUNTRY_CODES } from './countries';
import { EVERY_FOUR_CHARS, isString, validateAndFormat } from './utils';
import type { CountryCode } from './countries';
import type { BbanDescription, Specification } from './specification';

const IMMUTABLE_COUNTRIES: Readonly<Record<CountryCode, Specification>> =
  Object.freeze(
    Object.fromEntries(
      COUNTRY_CODES.map(code => {
        const specification = COUNTRIES[code];

        if (!specification) {
          throw new Error(`Missing country specification for ${code}`);
        }

        return [code, specification.clone()];
      }),
    ) as Record<CountryCode, Specification>,
  );

/* biome-ignore lint/style/useUnifiedTypeSignatures: Overloads distinguish typed vs runtime country codes */
export function getCountry(countryCode: CountryCode): Specification;
export function getCountry(countryCode: string): Specification;
export function getCountry(countryCode: string): Specification {
  const normalizedCountryCode = countryCode.toUpperCase().trim();
  const countryStructure = COUNTRIES[normalizedCountryCode];

  if (!countryStructure) {
    throw new Error(`No country with code ${normalizedCountryCode}`);
  }

  return countryStructure;
}

export type ValidationError =
  | 'unknown_country'
  | 'bad_length'
  | 'mod97_failure';

export type ValidationResult =
  | { ok: true }
  | { ok: false; error: ValidationError };

export const electronicFormat = (iban: string): string => {
  if (!isString(iban)) {
    throw new Error('IBAN must be a string');
  }

  return validateAndFormat(iban, true);
};

/**
 * Validate an IBAN without throwing, returning structured error information.
 * @param {string} iban the IBAN to validate
 * @returns {ValidationResult} the validation status and optional error code
 */
export const validate = (iban: string): ValidationResult => {
  let ibanFormatted: string;
  try {
    ibanFormatted = electronicFormat(iban);
  } catch {
    return { ok: false, error: 'bad_length' };
  }

  let countryStructure: Specification;
  try {
    countryStructure = getCountry(ibanFormatted.slice(0, 2));
  } catch {
    return { ok: false, error: 'unknown_country' };
  }

  const bban = ibanFormatted.slice(4);

  if (!countryStructure.isValidBBAN(bban)) {
    return { ok: false, error: 'bad_length' };
  }

  if (!countryStructure.isValid(ibanFormatted)) {
    return { ok: false, error: 'mod97_failure' };
  }

  return { ok: true };
};

/**
 * Check if an IBAN is valid. Does not throw an error if the IBAN is invalid.
 * @param {string} iban the IBAN to validate.
 * @returns {boolean} true if the passed IBAN is valid, false otherwise
 */
export const isValid = (iban: string): boolean => validate(iban).ok;

export interface DescribeResult extends BbanDescription {
  country: CountryCode;
  iban: string;
  bban: string;
}

/**
 * Provide the parsed BBAN blocks and regex groups for a given IBAN.
 * @param {string} iban the IBAN to describe
 * @returns {DescribeResult} metadata describing each BBAN block
 */
export const describe = (iban: string): DescribeResult => {
  if (!isString(iban)) {
    throw new Error('IBAN must be a string');
  }

  const ibanFormatted = electronicFormat(iban);
  const specification = getCountry(ibanFormatted.slice(0, 2));
  const bban = ibanFormatted.slice(4);
  const { blocks, groups } = specification.describeBBAN(bban);

  return {
    country: specification.countryCode as CountryCode,
    iban: ibanFormatted,
    bban,
    blocks,
    groups,
  };
};

/**
 * Convert an IBAN to a BBAN. Throws an error if the passed IBAN is invalid.
 * @param {string} iban the IBAN to convert
 * @param {string} [separator] the separator to use between the blocks of the BBAN, defaults to ' '
 * @returns {string} the BBAN
 */
export const toBBAN = (iban: string, separator = ' '): string => {
  if (!isString(iban)) {
    throw new Error('IBAN must be a string');
  }

  const ibanFormatted = electronicFormat(iban);

  return getCountry(ibanFormatted.slice(0, 2)).toBBAN(ibanFormatted, separator);
};

/**
 * Convert the passed BBAN to an IBAN for this country specification.
 * Please note that <i>"generation of the IBAN shall be the exclusive responsibility of the bank/branch servicing the account"</i>.
 * This method implements the preferred algorithm described in http://en.wikipedia.org/wiki/International_Bank_Account_Number#Generating_IBAN_check_digits
 * @param {CountryCode} countryCode the country of the BBAN
 * @param {string} bban the BBAN to convert to IBAN
 * @returns {string} the IBAN
 */
/* biome-ignore lint/style/useUnifiedTypeSignatures: Overloads distinguish typed vs runtime country codes */
export function fromBBAN(countryCode: CountryCode, bban: string): string;
export function fromBBAN(countryCode: string, bban: string): string;
export function fromBBAN(countryCode: string, bban: string): string {
  if (!isString(countryCode)) {
    throw new Error('Country code must be a string');
  }

  if (!isString(bban)) {
    throw new Error('BBAN must be a string');
  }

  return getCountry(countryCode).fromBBAN(validateAndFormat(bban, false));
}

/**
 * Check the validity of the passed BBAN.
 * @param {CountryCode} countryCode the country of the BBAN
 * @param {string} bban the BBAN to check the validity of
 * @returns {boolean} true if the passed BBAN is valid, false otherwise
 */
/* biome-ignore lint/style/useUnifiedTypeSignatures: Overloads distinguish typed vs runtime country codes */
export function isValidBBAN(countryCode: CountryCode, bban: string): boolean;
export function isValidBBAN(countryCode: string, bban: string): boolean;
export function isValidBBAN(countryCode: string, bban: string): boolean {
  if (!(isString(countryCode) && isString(bban))) {
    return false;
  }

  try {
    return getCountry(countryCode).isValidBBAN(validateAndFormat(bban, false));
  } catch {
    return false;
  }
}

/**
 * Format the passed IBAN to a printable format.
 * @param {string} iban the IBAN to format
 * @param {string} [separator] the separator to use between the blocks of the BBAN, defaults to ' '
 * @returns {string} the formatted IBAN
 */
export const printFormat = (iban: string, separator = ' '): string => {
  if (!isString(iban)) {
    throw new Error('IBAN must be a string');
  }

  return electronicFormat(iban).replaceAll(EVERY_FOUR_CHARS, `$1${separator}`);
};

export const availableCountries = (): Readonly<
  Record<CountryCode, Specification>
> => IMMUTABLE_COUNTRIES;
