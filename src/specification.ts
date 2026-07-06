import { A_CODE_POINT_AT } from './utils';

const PATTERN_FORMATS = {
  A: '0-9A-Za-z',
  B: '0-9A-Z',
  C: 'A-Za-z',
  F: '0-9',
  L: 'a-z',
  U: 'A-Z',
  W: '0-9a-z',
};

export type StructurePattern = keyof typeof PATTERN_FORMATS;

export type StructureBlockMetadata = {
  pattern: StructurePattern;
  length: number;
  offset: number;
  index: number;
};

export type BbanBlockDescription = StructureBlockMetadata & {
  value: string;
};

export type BbanDescription = {
  groups: Array<string>;
  blocks: Array<BbanBlockDescription>;
};

type StructureMetadata = {
  regex: RegExp;
  blocks: Array<StructureBlockMetadata>;
};

const isStructurePattern = (value: string): value is StructurePattern =>
  Object.hasOwn(PATTERN_FORMATS, value);

/**
 * Parse the BBAN structure used to configure each IBAN Specification and return both the matching
 * regular expression and the block metadata.
 * A structure is composed of blocks of 3 characters (one letter and 2 digits). Each block represents
 * a logical group in the typical representation of the BBAN. For each group, the letter indicates which characters
 * are allowed in this group and the following 2-digits number tells the length of the group.
 * @param {string} structure the structure to parse
 * @returns {StructureMetadata} the parsed metadata
 */
const parseStructure = (structure: string): StructureMetadata => {
  if (structure.length % 3 !== 0) {
    throw new Error(
      `Invalid structure "${structure}": length must be a multiple of 3`,
    );
  }

  const blockChunks = structure.match(/.{3}/g);

  if (!blockChunks) {
    throw new Error('Something went wrong while parsing the structure');
  }

  const blocks: Array<StructureBlockMetadata> = [];
  let offset = 0;

  const regexParts = blockChunks.map((chunk, index) => {
    const pattern = chunk.charAt(0);

    if (!isStructurePattern(pattern)) {
      throw new Error(`Unknown structure pattern "${pattern}"`);
    }

    const repeats = Number.parseInt(chunk.slice(1), 10);

    if (Number.isNaN(repeats)) {
      throw new Error('Invalid structure block length');
    }

    const format = PATTERN_FORMATS[pattern];

    blocks.push({
      pattern,
      length: repeats,
      offset,
      index,
    });

    offset += repeats;

    return `([${format}]{${repeats}})`;
  });

  return {
    regex: new RegExp(`^${regexParts.join('')}$`),
    blocks,
  };
};

/**
 * Calculates the MOD 97 10 of the passed IBAN as specified in ISO7064.
 * @param {string} iban the IBAN
 * @returns {number} MOD 97 10
 */
const iso7064Mod9710 = (iban: string): number => {
  let remainder = iban;

  while (remainder.length > 2) {
    const block = remainder.slice(0, 9);
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

  return val.replaceAll(/[A-Z]/g, match => {
    const codePoint = match.codePointAt(0);

    if (codePoint === undefined) {
      throw new Error('Invalid character in IBAN');
    }

    return (codePoint - A_CODE_POINT_AT + 10).toString();
  });
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
  readonly #countryCode: string;
  readonly #example: string;
  readonly #length: number;
  readonly #structure: string;
  #cachedStructure: StructureMetadata | undefined;

  constructor(
    countryCode: string,
    length: number,
    structure: string,
    example: string,
  ) {
    this.#countryCode = countryCode;
    this.#length = length;
    this.#structure = structure;
    this.#example = example;
    // Blocks both assignment and Object.defineProperty shadowing of the
    // prototype getters; private fields stay writable, so the lazy
    // #cachedStructure is unaffected.
    Object.freeze(this);
  }

  /**
   * The ISO 3166-1 alpha-2 country code of this specification.
   * @returns {string} the country code
   */
  get countryCode(): string {
    return this.#countryCode;
  }

  /**
   * An example of a valid IBAN for this specification.
   * @returns {string} the example IBAN
   */
  get example(): string {
    return this.#example;
  }

  /**
   * Check if the passed iban is valid according to this specification.
   * @param {string} iban the iban to validate
   * @returns {boolean} true if valid, false otherwise
   */
  isValid(iban: string): boolean {
    return (
      this.#length === iban.length &&
      this.#countryCode === iban.slice(0, 2) &&
      this.regex().test(iban.slice(4)) &&
      iso7064Mod9710(iso13616Prepare(iban)) === 1
    );
  }

  /**
   * Convert the passed IBAN to a country-specific BBAN.
   * Throws an error if the IBAN is not valid according to this specification,
   * including its ISO 7064 mod 97-10 check digits.
   * @param {string} iban the IBAN to convert
   * @param {string} separator the separator to use between BBAN blocks
   * @returns {string} the BBAN
   */
  toBBAN(iban: string, separator: string): string {
    if (!this.isValid(iban)) {
      throw new Error('Invalid IBAN');
    }

    const regexMatch = this.regex().exec(iban.slice(4));

    if (!regexMatch) {
      throw new Error('Invalid IBAN');
    }

    return regexMatch.slice(1).join(separator);
  }

  /**
   * Describe the BBAN part of an IBAN using the specification structure metadata.
   * @param {string} bban the BBAN to describe
   * @returns {BbanDescription} extracted block metadata and regex groups
   */
  describeBBAN(bban: string): BbanDescription {
    const metadata = this.structureMetadata();
    const regexMatch = metadata.regex.exec(bban);

    if (!regexMatch) {
      throw new Error('Invalid IBAN');
    }

    const groups = regexMatch.slice(1);

    return {
      groups,
      blocks: metadata.blocks.map((block, index) => {
        const value = groups[index];

        if (value === undefined) {
          throw new Error('Invalid IBAN');
        }

        return {
          ...block,
          value,
        };
      }),
    };
  }

  /**
   * Convert the passed BBAN to an IBAN for this country specification.
   * Please note that <i>"generation of the IBAN shall be the exclusive responsibility of the bank/branch servicing the account"</i>.
   * This method implements the preferred algorithm described in http://en.wikipedia.org/wiki/International_Bank_Account_Number#Generating_IBAN_check_digits
   * @param {string} bban the BBAN to convert to IBAN
   * @returns {string} the IBAN
   */
  fromBBAN(bban: string): string {
    if (!this.isValidBBAN(bban)) {
      throw new Error('Invalid BBAN');
    }

    const remainder = iso7064Mod9710(
      iso13616Prepare(`${this.#countryCode}00${bban}`),
    );
    const checkDigit = `0${98 - remainder}`.slice(-2);

    return `${this.#countryCode}${checkDigit}${bban}`;
  }

  /**
   * Check if the passed BBAN has the length expected by this specification.
   * @param {string} bban the BBAN to check
   * @returns {boolean} true if the passed bban has the expected length, false otherwise
   */
  hasValidBBANLength(bban: string): boolean {
    return this.#length - 4 === bban.length;
  }

  /**
   * Check if the passed BBAN matches the block structure (character classes and block lengths)
   * of this specification, regardless of check digits.
   * @param {string} bban the BBAN to check
   * @returns {boolean} true if the passed bban matches the structure, false otherwise
   */
  matchesBBANStructure(bban: string): boolean {
    return this.regex().test(bban);
  }

  /**
   * Check of the passed BBAN is valid.
   * This function only checks the format of the BBAN (length and matching the letetr/number specs) but does not
   * verify the check digit.
   * @param {string} bban the BBAN to validate
   * @returns {boolean} true if the passed bban is a valid BBAN according to this specification, false otherwise
   */
  isValidBBAN(bban: string): boolean {
    return this.hasValidBBANLength(bban) && this.matchesBBANStructure(bban);
  }

  /**
   * Expose the BBAN parsing metadata and regex for reuse without reparsing.
   * @returns {StructureMetadata} Structure metadata
   */
  private structureMetadata(): StructureMetadata {
    this.#cachedStructure ??= parseStructure(this.#structure);

    return this.#cachedStructure;
  }

  /**
   * Lazy-loaded regex (parse the structure and construct the regular expression the first time we need it for validation)
   * @returns {RegExp} Regexp
   */
  private regex(): RegExp {
    return this.structureMetadata().regex;
  }
}
