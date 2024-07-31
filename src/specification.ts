import { A_CODE_POINT_AT } from './utils';

/**
 * Parse the BBAN structure used to configure each IBAN Specification and returns a matching regular expression.
 * A structure is composed of blocks of 3 characters (one letter and 2 digits). Each block represents
 * a logical group in the typical representation of the BBAN. For each group, the letter indicates which characters
 * are allowed in this group and the following 2-digits number tells the length of the group.
 * @param {string} structure the structure to parse
 * @returns {RegExp} the regular expression
 */
const parseStructure = (structure: string): RegExp => {
  // split in blocks of 3 chars
  const regex = structure.match(/.{3}/g)?.map(block => {
    // parse each structure block (1-char + 2-digits)
    let format;
    const pattern = block[0];
    const repeats = Number.parseInt(block.slice(1), 10);

    // eslint-disable-next-line default-case
    switch (pattern) {
      case 'A': {
        format = '0-9A-Za-z';

        break;
      }

      case 'B': {
        format = '0-9A-Z';

        break;
      }

      case 'C': {
        format = 'A-Za-z';

        break;
      }

      case 'F': {
        format = '0-9';

        break;
      }

      case 'L': {
        format = 'a-z';

        break;
      }

      case 'U': {
        format = 'A-Z';

        break;
      }

      case 'W': {
        format = '0-9a-z';

        break;
      }
    }

    return `([${format}]{${repeats}})`;
  });

  if (!regex) {
    throw new Error('Something went wrong while parsing the structure');
  }

  return new RegExp(`^${regex.join('')}$`);
};

/**
 * Calculates the MOD 97 10 of the passed IBAN as specified in ISO7064.
 * @param {string} iban the IBAN
 * @returns {number} MOD 97 10
 */
const iso7064Mod9710 = (iban: string): number => {
  let remainder = iban;
  let block;

  while (remainder.length > 2) {
    block = remainder.slice(0, 9);
    remainder = `${Number.parseInt(block, 10) % 97}${remainder.slice(block.length)}`;
  }

  return Number.parseInt(remainder, 10) % 97;
};

/**
 * Prepare an IBAN for mod 97 computation by moving the first 4 chars to the end and transforming the letters to
 * numbers (A = 10, B = 11, ..., Z = 35), as specified in ISO13616.
 * @param {string} iban the IBAN
 * @returns {string} the prepared IBAN
 */
const iso13616Prepare = (iban: string): string => {
  let val = iban.toUpperCase();

  val = val.slice(4) + val.slice(0, 4);

  return val.replaceAll(/[A-Z]/g, match =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (match.codePointAt(0)! - A_CODE_POINT_AT + 10).toString(),
  );
};

/**
 * Create a new Specification for a valid IBAN number.
 * @param countryCode the code of the country
 * @param length the length of the IBAN
 * @param structure the structure of the underlying BBAN (for validation and formatting)
 * @param example an example valid IBAN
 * @class
 */
export class Specification {
  private cachedRegex: RegExp | undefined;

  constructor(
    public countryCode: string,
    private length: number,
    private structure: string,
    public example: string,
  ) {}

  /**
   * Check if the passed iban is valid according to this specification.
   * @param {string} iban the iban to validate
   * @returns {boolean} true if valid, false otherwise
   */
  public isValid(iban: string): boolean {
    return (
      this.length === iban.length &&
      this.countryCode === iban.slice(0, 2) &&
      this.regex().test(iban.slice(4)) &&
      iso7064Mod9710(iso13616Prepare(iban)) === 1
    );
  }

  /**
   * Convert the passed IBAN to a country-specific BBAN.
   * @param {string} iban the IBAN to convert
   * @param {string} separator the separator to use between BBAN blocks
   * @returns {string} the BBAN
   */
  public toBBAN(iban: string, separator: string): string {
    const regexMatch = this.regex().exec(iban.slice(4));

    if (!regexMatch) {
      throw new Error('Invalid IBAN');
    }

    return regexMatch.slice(1).join(separator);
  }

  /**
   * Convert the passed BBAN to an IBAN for this country specification.
   * Please note that <i>"generation of the IBAN shall be the exclusive responsibility of the bank/branch servicing the account"</i>.
   * This method implements the preferred algorithm described in http://en.wikipedia.org/wiki/International_Bank_Account_Number#Generating_IBAN_check_digits
   * @param {string} bban the BBAN to convert to IBAN
   * @returns {string} the IBAN
   */
  public fromBBAN(bban: string): string {
    if (!this.isValidBBAN(bban)) {
      throw new Error('Invalid BBAN');
    }

    const remainder = iso7064Mod9710(
      iso13616Prepare(`${this.countryCode}00${bban}`),
    );
    const checkDigit = `0${98 - remainder}`.slice(-2);

    return `${this.countryCode}${checkDigit}${bban}`;
  }

  /**
   * Check of the passed BBAN is valid.
   * This function only checks the format of the BBAN (length and matching the letetr/number specs) but does not
   * verify the check digit.
   * @param {string} bban the BBAN to validate
   * @returns {boolean} true if the passed bban is a valid BBAN according to this specification, false otherwise
   */
  public isValidBBAN(bban: string): boolean {
    return this.length - 4 === bban.length && this.regex().test(bban);
  }

  /**
   * Lazy-loaded regex (parse the structure and construct the regular expression the first time we need it for validation)
   * @returns {RegExp} Regexp
   */
  private regex(): RegExp {
    if (!this.cachedRegex) {
      this.cachedRegex = parseStructure(this.structure);
    }

    return this.cachedRegex;
  }
}
