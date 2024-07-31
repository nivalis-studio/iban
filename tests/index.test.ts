import { describe, expect, it } from 'bun:test';
import {
  availableCountries,
  electronicFormat,
  fromBBAN,
  isValid,
  isValidBBAN,
  printFormat,
  toBBAN,
} from '../src/index';

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

    it('should return true for a valid belgian IBAN', () => {
      expect(isValid('BE68539007547034')).toBe(true);
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

      for (const countryCode of Object.keys(countryList)) {
        expect(isValid(countryList[countryCode].example)).toBe(true);
      }
    });

    it('should return false for all examples when modifying just one digit', () => {
      const countryList = availableCountries();

      for (const countryCode of Object.keys(countryList)) {
        let num = countryList[countryCode].example;

        num = `${num.slice(0, -1)}${(Number.parseInt(num.slice(-1), 10) + 1) % 10}`;
        expect(isValid(num)).toBe(false);
      }
    });

    it('should return true for a valid Egypt IBAN', () => {
      expect(isValid('EG800002000156789012345180002')).toBe(true);
    });
  });

  describe('.electronicFormat', () => {
    it('should format a e-formatted belgian IBAN', () => {
      expect(electronicFormat('BE68539007547034')).toBe('BE68539007547034');
    });

    it('should format a print-formatted belgian IBAN', () => {
      expect(electronicFormat('BE68 5390 0754 7034')).toBe('BE68539007547034');
    });
  });

  describe('.printFormat', () => {
    it('should format a e-formatted belgian IBAN', () => {
      expect(printFormat('BE68539007547034')).toBe('BE68 5390 0754 7034');
    });

    it('should format a print-formatted belgian IBAN', () => {
      expect(printFormat('BE68 5390 0754 7034')).toBe('BE68 5390 0754 7034');
    });
  });

  describe('.toBBAN', () => {
    it('should output the right BBAN from a Belgian IBAN', () => {
      expect(toBBAN('BE68 5390 0754 7034', '-')).toBe('539-0075470-34');
    });

    it('should use space as default separator', () => {
      expect(toBBAN('BE68 5390 0754 7034')).toBe('539 0075470 34');
    });
  });

  describe('.fromBBAN', () => {
    it('should output the right IBAN from a Belgian BBAN', () => {
      expect(fromBBAN('BE', '539007547034')).toBe('BE68539007547034');
    });

    it('should output the right IBAN from a Belgian BBAN, ignoring format', () => {
      expect(fromBBAN('BE', '539-0075470-34')).toBe('BE68539007547034');
    });

    it('should throw an error if the BBAN is invalid', () => {
      expect(() => {
        fromBBAN('BE', '1539-0075470-34');
      }).toThrowError(/Invalid BBAN/);
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

    it('should detect invalid BBAN length', () => {
      expect(isValidBBAN('BE', '1539-0075470-34')).toBe(false);
    });

    it('should detect invalid BBAN format', () => {
      expect(isValidBBAN('BE', 'ABC-0075470-34')).toBe(false);
    });
  });
});
