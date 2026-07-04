# @nivalis/iban

[![npm version](https://badge.fury.io/js/@nivalis%2Fiban.svg)](https://badge.fury.io/js/@nivalis%2Fiban)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, lightweight TypeScript library for validating, formatting, and converting International Bank Account Numbers (IBANs) and Basic Bank Account Numbers (BBANs).

## Features

- ✅ **Comprehensive IBAN validation** - Validates IBANs according to ISO 13616 standard
- 🌍 **Wide country support** - Supports 70+ countries and territories
- 🔄 **IBAN ↔ BBAN conversion** - Convert between IBAN and country-specific BBAN formats
- 📝 **Flexible formatting** - Format IBANs for display or electronic processing
- 🎯 **TypeScript native** - Built with TypeScript for excellent type safety
- 📦 **Zero dependencies** - Lightweight with no external dependencies
- 🚀 **Modern ESM/CJS** - Supports both ES modules and CommonJS
- ✨ **Tree-shakable** - Import only what you need

## Installation

```bash
# npm
npm install @nivalis/iban

# pnpm
pnpm add @nivalis/iban

# yarn
yarn add @nivalis/iban

# bun
bun add @nivalis/iban
```

## Quick Start

```typescript
import { isValid, printFormat, toBBAN } from '@nivalis/iban';

// Validate an IBAN
isValid('GB29NWBK60161331926819'); // true
isValid('GB29NWBK60161331926820'); // false (wrong check digit)

// Format for display
printFormat('GB29NWBK60161331926819'); // 'GB29 NWBK 6016 1331 9268 19'

// Convert to BBAN
toBBAN('GB29NWBK60161331926819'); // 'NWBK 60161331926819'
```

## API Reference

### `isValid(iban: string): boolean`

Validates an IBAN according to the ISO 13616 standard.

```typescript
import { isValid } from '@nivalis/iban';

isValid('BE68539007547034'); // true
isValid('BE68539007547035'); // false
isValid('invalid'); // false
```

### `validate(iban: string): ValidationResult`

Runs the same validation as `isValid` but returns structured error information instead of throwing exceptions.

```typescript
import { validate } from '@nivalis/iban';

const result = validate('GB29NWBK60161331926819');
// { ok: true }

const failed = validate('ZZ68539007547034');
// { ok: false, error: 'unknown_country' }
```

Possible `error` codes are:

- `unknown_country` – the IBAN prefix is not part of the ISO registry supported by the library
- `bad_length` – the IBAN is too short/long or has an invalid BBAN structure for its country
- `mod97_failure` – the checksum (ISO 7064 Mod 97-10) does not evaluate to 1

### `describe(iban: string): DescribeResult`

Exposes the parsed BBAN blocks for a given IBAN so you can display the bank/branch/account slices without reimplementing the ISO structure tables.

The returned object contains:

- `country` – ISO country code detected from the IBAN
- `iban` / `bban` – sanitized electronic representations
- `groups` – raw regex capture groups, matching the BBAN blocks in order
- `blocks` – metadata for each BBAN block including `pattern`, `length`, `offset`, `index`, and the extracted `value`

```typescript
import { describe } from '@nivalis/iban';

const { country, blocks } = describe('BE68 5390 0754 7034');
// country === 'BE'
// blocks === [
//   { pattern: 'F', length: 3, offset: 0, index: 0, value: '539' },
//   { pattern: 'F', length: 7, offset: 3, index: 1, value: '0075470' },
//   { pattern: 'F', length: 2, offset: 10, index: 2, value: '34' },
// ];
```

### `electronicFormat(iban: string): string`

Converts an IBAN to electronic format (removes spaces and converts to uppercase).

```typescript
import { electronicFormat } from '@nivalis/iban';

electronicFormat('be68 5390 0754 7034'); // 'BE68539007547034'
electronicFormat('BE68539007547034'); // 'BE68539007547034'
```

### `printFormat(iban: string, separator?: string): string`

Formats an IBAN for display with optional custom separator (defaults to space).

```typescript
import { printFormat } from '@nivalis/iban';

printFormat('BE68539007547034'); // 'BE68 5390 0754 7034'
printFormat('BE68539007547034', '-'); // 'BE68-5390-0754-7034'
```

### `toBBAN(iban: string, separator?: string): string`

Converts an IBAN to its corresponding BBAN (Basic Bank Account Number).

```typescript
import { toBBAN } from '@nivalis/iban';

toBBAN('BE68539007547034'); // '539 0075470 34'
toBBAN('BE68539007547034', '-'); // '539-0075470-34'
```

### `fromBBAN(countryCode: string, bban: string): string`

Generates an IBAN from a country code and BBAN.

```typescript
import { fromBBAN } from '@nivalis/iban';

fromBBAN('BE', '539007547034'); // 'BE68539007547034'
fromBBAN('BE', '539-0075470-34'); // 'BE68539007547034' (ignores formatting)
```

### `isValidBBAN(countryCode: string, bban: string): boolean`

Validates a BBAN for a specific country.

```typescript
import { isValidBBAN } from '@nivalis/iban';

isValidBBAN('BE', '539007547034'); // true
isValidBBAN('BE', '539-0075470-34'); // true (ignores formatting)
isValidBBAN('BE', '1539007547034'); // false (invalid length)
```

### `availableCountries(): { [key: string]: Specification }`

Returns all supported country specifications.

```typescript
import { availableCountries } from '@nivalis/iban';

const countries = availableCountries();
console.log(Object.keys(countries)); // ['AD', 'AE', 'AL', 'AT', ...]
console.log(countries['BE'].example); // 'BE68539007547034'
```

## Input Sanitization

Every IBAN or BBAN string passed to the library is stripped of all non-alphanumeric characters (anything outside `A-Z`, `a-z`, `0-9`) and converted to uppercase **before** any validation, formatting, or conversion takes place. This applies to spaces, dashes, punctuation, symbols, and unicode characters alike.

Country-code arguments (the first parameter of `fromBBAN` and `isValidBBAN`) are the exception: they are only trimmed and uppercased, never stripped — `fromBBAN('B-E', ...)` throws instead of being sanitized to `'BE'`.

This lenient behavior is intentional and matches the legacy [iban.js](https://github.com/arhs/iban.js) library: IBANs copied from print-formatted documents, bank statements, or web pages often contain separators or stray characters, and they should still validate.

```typescript
import { isValid, electronicFormat } from '@nivalis/iban';

// Separators and formatting characters are ignored
isValid('BE68 5390 0754 7034'); // true
isValid('BE68-5390-0754-7034'); // true

// So are arbitrary symbols and unicode characters
isValid('BE68_5390!0754@7034'); // true
isValid('BE68·5390·0754·7034é'); // true

electronicFormat('BE68·5390·0754·7034é'); // 'BE68539007547034'
```

Keep in mind the consequences:

- Sanitization happens before **all** validation, so `validate()` can never report an error for a stripped character — a string containing junk characters is judged solely on its remaining alphanumeric content
- If you need to reject inputs containing unexpected characters, check the raw string yourself before calling the library

## Supported Countries

The library supports IBAN validation for 70+ countries and territories:

| Country | Code | Example IBAN |
|---------|------|--------------|
| Belgium | BE | BE68539007547034 |
| Germany | DE | DE89370400440532013000 |
| France | FR | FR1420041010050500013M02606 |
| United Kingdom | GB | GB29NWBK60161331926819 |
| Netherlands | NL | NL91ABNA0417164300 |
| Spain | ES | ES9121000418450200051332 |
| Italy | IT | IT60X0542811101000000123456 |

<details>
<summary>View all supported countries</summary>

Andorra (AD), United Arab Emirates (AE), Albania (AL), Austria (AT), Azerbaijan (AZ), Bosnia and Herzegovina (BA), Belgium (BE), Bulgaria (BG), Bahrain (BH), Brazil (BR), Belarus (BY), Switzerland (CH), Costa Rica (CR), Cyprus (CY), Czech Republic (CZ), Germany (DE), Denmark (DK), Dominican Republic (DO), Estonia (EE), Egypt (EG), Spain (ES), Finland (FI), Faroe Islands (FO), France (FR), United Kingdom (GB), Georgia (GE), Gibraltar (GI), Greenland (GL), Greece (GR), Guatemala (GT), Croatia (HR), Hungary (HU), Ireland (IE), Israel (IL), Iceland (IS), Italy (IT), Iraq (IQ), Jordan (JO), Kuwait (KW), Kazakhstan (KZ), Lebanon (LB), Saint Lucia (LC), Liechtenstein (LI), Lithuania (LT), Luxembourg (LU), Monaco (MC), Moldova (MD), Montenegro (ME), North Macedonia (MK), Mauritania (MR), Malta (MT), Mauritius (MU), Netherlands (NL), Norway (NO), Pakistan (PK), Poland (PL), Palestine (PS), Portugal (PT), Qatar (QA), Romania (RO), Serbia (RS), Saudi Arabia (SA), Seychelles (SC), Sweden (SE), Slovenia (SI), Slovakia (SK), San Marino (SM), São Tomé and Príncipe (ST), El Salvador (SV), Timor-Leste (TL), Tunisia (TN), Turkey (TR), Ukraine (UA), Vatican City (VA).

</details>

## Examples

### Basic Validation

```typescript
import { isValid } from '@nivalis/iban';

// Valid IBANs
console.log(isValid('DE89370400440532013000')); // true
console.log(isValid('FR1420041010050500013M02606')); // true
console.log(isValid('IT60X0542811101000000123456')); // true

// Invalid IBANs
console.log(isValid('DE89370400440532013001')); // false (wrong check digit)
console.log(isValid('ZZ68539007547034')); // false (unknown country)
console.log(isValid('invalid')); // false (invalid format)
```

### Formatting and Display

```typescript
import { printFormat, electronicFormat } from '@nivalis/iban';

const iban = 'de89 3704 0044 0532 0130 00';

// Clean and format
const electronic = electronicFormat(iban); // 'DE89370400440532013000'
const display = printFormat(electronic); // 'DE89 3704 0044 0532 0130 00'

// Custom separator
const customFormat = printFormat(electronic, '-'); // 'DE89-3704-0044-0532-0130-00'
```

### IBAN/BBAN Conversion

```typescript
import { toBBAN, fromBBAN, isValidBBAN } from '@nivalis/iban';

const iban = 'BE68539007547034';

// Convert to BBAN
const bban = toBBAN(iban); // '539 0075470 34'
console.log(isValidBBAN('BE', bban)); // true

// Convert back to IBAN
const regeneratedIban = fromBBAN('BE', bban); // 'BE68539007547034'
console.log(iban === regeneratedIban); // true
```

### Working with Different Countries

```typescript
import { isValid, toBBAN, fromBBAN } from '@nivalis/iban';

// Dutch IBAN
const dutchIban = 'NL91ABNA0417164300';
console.log(isValid(dutchIban)); // true
console.log(toBBAN(dutchIban)); // 'ABNA 0417164300'

// French IBAN
const frenchIban = 'FR1420041010050500013M02606';
console.log(isValid(frenchIban)); // true
console.log(toBBAN(frenchIban)); // '20041 01005 0500013M026 06'

// Generate German IBAN from BBAN
const germanBban = '370400440532013000';
const germanIban = fromBBAN('DE', germanBban); // 'DE89370400440532013000'
```

## Error Handling

```typescript
import { fromBBAN, toBBAN } from '@nivalis/iban';

try {
  // This will throw an error for invalid BBAN
  fromBBAN('BE', 'invalid-bban');
} catch (error) {
  console.log(error.message); // "Invalid BBAN"
}

try {
  // This will throw an error for unknown country
  toBBAN('ZZ68539007547034');
} catch (error) {
  console.log(error.message); // "No country with code ZZ"
}
```

## TypeScript Support

This library is written in TypeScript and provides full type definitions:

```typescript
import type { Specification } from '@nivalis/iban';
import { availableCountries, isValid } from '@nivalis/iban';

// Get type-safe country specifications
const countries: { [key: string]: Specification } = availableCountries();

// Type-safe validation
const isValidIban: boolean = isValid('BE68539007547034');
```

## Development

### Prerequisites

- [Bun](https://bun.sh/) >= 1.2.17
- [TypeScript](https://www.typescriptlang.org/) >= 5.0

### Setup

```bash
# Clone the repository
git clone https://github.com/nivalis-studio/iban.git
cd iban

# Install dependencies
bun install

# Run tests
bun test

# Build the package
bun run build

# Lint code
bun run lint
```

### Testing

The library includes comprehensive tests covering:

- IBAN validation for all supported countries
- BBAN validation and conversion
- Formatting functions
- Error handling
- Edge cases

```bash
# Run all tests
bun test

# Run tests with coverage
bun test --coverage
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Guidelines

1. Ensure tests pass: `bun test`
2. Follow the existing code style: `bun run lint`
3. Add tests for new features
4. Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Related

- [IBAN Registry](https://www.swift.com/standards/data-standards/iban-registry) - Official IBAN country specifications
- [ISO 13616](https://www.iso.org/standard/81090.html) - International standard for IBAN
- [ISO 7064](https://www.iso.org/standard/31531.html) - Check digit algorithms

---

Made with ❤️ by [Nivalis Studio](https://github.com/nivalis-studio)
