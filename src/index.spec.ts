import { describe, expect, it } from 'bun:test';
import {
  availableCountries,
  describe as describeIban,
  electronicFormat,
  fromBBAN,
  isValid,
  isValidBBAN,
  printFormat,
  toBBAN,
  validate,
} from './index';
import type { CountryCode } from './countries';

const INVALID_BBAN_REGEX = /Invalid BBAN/;

describe('IBAN', () => {
  describe('.isValid', () => {
    it('should return false when input is not a String', () => {
      // @ts-expect-error test the case of an invalid param type
      expect(isValid(1)).toBe(false);
      // @ts-expect-error test the case of an invalid param type
      expect(isValid([])).toBe(false);
      // @ts-expect-error test the case of an invalid param type
      expect(isValid({})).toBe(false);
      // @ts-expect-error test the case of an invalid param type
      expect(isValid(true)).toBe(false);
    });

    it('should return false for an unknown country code digit', () => {
      expect(isValid('ZZ68539007547034')).toBe(false);
    });

    it('should parse long IBANs', () => {
      expect(isValid('MT84 MALT 0110 0001 2345 MTL CAST 001S')).toBe(true);
    });

    it('should return true for a valid belgian IBAN', () => {
      expect(isValid('BE68539007547034')).toBe(true);
    });

    it('should return true for a valid belgian IBAN', () => {
      expect(isValid('be68539007547034')).toBe(true);
    });

    it('should return true for a valid Dutch IBAN', () => {
      expect(isValid('NL86INGB0002445588')).toBe(true);
    });

    it('should return true for a valid Moldovan IBAN', () => {
      expect(isValid('MD75EX0900002374642125EU')).toBe(true);
    });

    it('should return true for a valid Saint-Lucia IBAN', () => {
      expect(isValid('LC55HEMM000100010012001200023015')).toBe(true);
    });

    it('should return false for an incorrect check digit', () => {
      expect(isValid('BE68539007547035')).toBe(false);
    });

    it("should return true for a valid Côte d'Ivoire IBAN", () => {
      expect(isValid('CI93CI0080111301134291200589')).toBe(true);
    });

    it('should return true for all examples', () => {
      const countryList = availableCountries();

      for (const countryCode of Object.keys(
        countryList,
      ) as Array<CountryCode>) {
        const country = countryList[countryCode];

        if (!country) {
          throw new Error(`Missing country specification for ${countryCode}`);
        }

        expect(isValid(country.example)).toBe(true);
      }
    });

    it('should return false for all examples when modifying just one digit', () => {
      const countryList = availableCountries();

      for (const countryCode of Object.keys(
        countryList,
      ) as Array<CountryCode>) {
        const country = countryList[countryCode];

        if (!country) {
          throw new Error(`Missing country specification for ${countryCode}`);
        }

        let num = country.example;

        num = `${num.slice(0, -1)}${(Number.parseInt(num.slice(-1), 10) + 1) % 10}`;
        expect(isValid(num)).toBe(false);
      }
    });

    it('should return true for a valid Egypt IBAN', () => {
      expect(isValid('EG800002000156789012345180002')).toBe(true);
    });

    it('should return true for a valid Burundian IBAN', () => {
      expect(isValid('BI4210000100010000332045181')).toBe(true);
    });

    it('should return false for the old 16-character Burundian format', () => {
      expect(isValid('BI41123456789012')).toBe(false);
    });
  });

  describe('.describe', () => {
    it('should throw an error for non-string input', () => {
      // @ts-expect-error test the case of an invalid param type
      expect(() => describeIban(123)).toThrow('IBAN must be a string');
    });

    it('should expose block metadata for a Belgian IBAN', () => {
      const details = describeIban('BE68 5390 0754 7034');

      expect(details.country).toBe('BE');
      expect(details.iban).toBe('BE68539007547034');
      expect(details.bban).toBe('539007547034');
      expect(details.groups).toEqual(['539', '0075470', '34']);
      expect(details.blocks).toEqual([
        { pattern: 'F', length: 3, offset: 0, index: 0, value: '539' },
        { pattern: 'F', length: 7, offset: 3, index: 1, value: '0075470' },
        { pattern: 'F', length: 2, offset: 10, index: 2, value: '34' },
      ]);
    });
  });

  describe('.validate', () => {
    it('should return ok true for a valid IBAN', () => {
      expect(validate('BE68539007547034')).toEqual({ ok: true });
    });

    it('should classify a short IBAN as bad_length', () => {
      expect(validate('BE68')).toEqual({ ok: false, error: 'bad_length' });
    });

    it('should classify an over-long input as bad_length', () => {
      expect(validate(`BE68${'5'.repeat(40)}`)).toEqual({
        ok: false,
        error: 'bad_length',
      });
    });

    it('should classify a BBAN with the wrong length as bad_length', () => {
      expect(validate('BE6853900754703412')).toEqual({
        ok: false,
        error: 'bad_length',
      });
    });

    it('should classify wrong characters at the right length as bad_format', () => {
      expect(validate('NL91ABNA041716430A')).toEqual({
        ok: false,
        error: 'bad_format',
      });
    });

    it('should detect unknown countries', () => {
      expect(validate('ZZ68539007547034')).toEqual({
        ok: false,
        error: 'unknown_country',
      });
    });

    it('should surface mod97 failures', () => {
      expect(validate('BE68539007547035')).toEqual({
        ok: false,
        error: 'mod97_failure',
      });
    });

    it('should return invalid_input when input is not a string', () => {
      // @ts-expect-error test the case of an invalid param type
      expect(validate(123)).toEqual({ ok: false, error: 'invalid_input' });
    });
  });

  describe('.electronicFormat', () => {
    it('should format a e-formatted belgian IBAN', () => {
      expect(electronicFormat('BE68539007547034')).toBe('BE68539007547034');
    });

    it('should format a print-formatted belgian IBAN', () => {
      expect(electronicFormat('BE68 5390 0754 7034')).toBe('BE68539007547034');
    });

    it('should throw an error for non-string input', () => {
      // @ts-expect-error test the case of an invalid param type
      expect(() => electronicFormat(123)).toThrow('IBAN must be a string');
    });

    it('should throw an error for IBAN that is too long', () => {
      const tooLongIban = 'BE68539007547034'.repeat(3); // 48 characters

      expect(() => electronicFormat(tooLongIban)).toThrow('Input too long');
    });

    it('should throw an error for IBAN that is too short', () => {
      expect(() => electronicFormat('BE68')).toThrow('IBAN too short');
    });

    it('should sanitize grouped long IBANs before enforcing length', () => {
      const groupedMalta = 'MT84 MALT-0110 0001 2345 MTL CAST 001S';

      expect(electronicFormat(groupedMalta)).toBe(
        'MT84MALT011000012345MTLCAST001S',
      );
    });
  });

  describe('.printFormat', () => {
    it('should format a e-formatted belgian IBAN', () => {
      expect(printFormat('BE68539007547034')).toBe('BE68 5390 0754 7034');
    });

    it('should format a print-formatted belgian IBAN', () => {
      expect(printFormat('BE68 5390 0754 7034')).toBe('BE68 5390 0754 7034');
    });

    it('should throw an error for non-string input', () => {
      // @ts-expect-error test the case of an invalid param type
      expect(() => printFormat(123)).toThrow('IBAN must be a string');
    });

    it('should sanitize grouped long IBANs before formatting', () => {
      const groupedSaintLucia = 'LC07 HEMM-0001 0001-0012 0012-0001 3015';

      expect(printFormat(groupedSaintLucia)).toBe(
        'LC07 HEMM 0001 0001 0012 0012 0001 3015',
      );
    });
  });

  describe('.toBBAN', () => {
    it('should output the right BBAN from a Belgian IBAN', () => {
      expect(toBBAN('BE68 5390 0754 7034', '-')).toBe('539-0075470-34');
    });

    it('should use space as default separator', () => {
      expect(toBBAN('BE68 5390 0754 7034')).toBe('539 0075470 34');
    });

    it('should throw an error for non-string input', () => {
      // @ts-expect-error test the case of an invalid param type
      expect(() => toBBAN(123)).toThrow('IBAN must be a string');
    });
  });

  describe('.fromBBAN', () => {
    it('should output the right IBAN from a Belgian BBAN', () => {
      expect(fromBBAN('BE', '539007547034')).toBe('BE68539007547034');
    });

    it('should output the right IBAN from a Belgian BBAN when using lowercase country code', () => {
      expect(fromBBAN('be', '539007547034')).toBe('BE68539007547034');
    });

    it('should output the right IBAN from a Belgian BBAN, ignoring format', () => {
      expect(fromBBAN('BE', '539-0075470-34')).toBe('BE68539007547034');
    });

    it('should throw an error if the BBAN is invalid', () => {
      expect(() => {
        fromBBAN('BE', '1539-0075470-34');
      }).toThrowError(INVALID_BBAN_REGEX);
    });

    it('should throw an error for non-string countryCode', () => {
      // @ts-expect-error test the case of an invalid param type
      expect(() => fromBBAN(123, '539007547034')).toThrow(
        'Country code must be a string',
      );
    });

    it('should throw an error for non-string BBAN', () => {
      // @ts-expect-error test the case of an invalid param type
      expect(() => fromBBAN('BE', 123)).toThrow('BBAN must be a string');
    });
  });

  describe('.isValidBBAN', () => {
    it('should return false when input is not a String', () => {
      // @ts-expect-error test the case of an invalid param type
      expect(isValidBBAN('BE', 1)).toBe(false);
      // @ts-expect-error test the case of an invalid param type
      expect(isValidBBAN('BE', {})).toBe(false);
      // @ts-expect-error test the case of an invalid param type
      expect(isValidBBAN('BE', [])).toBe(false);
      // @ts-expect-error test the case of an invalid param type
      expect(isValidBBAN('BE', true)).toBe(false);
    });

    it('should validate a correct Belgian BBAN', () => {
      expect(isValidBBAN('BE', '539007547034')).toBe(true);
    });

    it('should return true for a valid Dutch IBAN', () => {
      expect(isValidBBAN('NL', 'INGB0002445588')).toBe(true);
    });

    it('should validate a correct Belgian BBAN, ignoring format', () => {
      expect(isValidBBAN('BE', '539-0075470-34')).toBe(true);
    });

    it('should validate a correct lowercase Belgian BBAN, ignoring format', () => {
      expect(isValidBBAN('be', '539-0075470-34')).toBe(true);
    });

    it('should detect invalid BBAN length', () => {
      expect(isValidBBAN('BE', '1539-0075470-34')).toBe(false);
    });

    it('should detect invalid BBAN format', () => {
      expect(isValidBBAN('BE', 'ABC-0075470-34')).toBe(false);
    });

    it('should return false for non-string countryCode', () => {
      // @ts-expect-error test the case of an invalid param type
      expect(isValidBBAN(123, '539007547034')).toBe(false);
    });
  });
});
