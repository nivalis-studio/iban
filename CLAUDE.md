# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**@nivalis/iban** is a modern TypeScript library for validating, formatting, and converting International Bank Account Numbers (IBANs) and Basic Bank Account Numbers (BBANs). It supports 110+ countries and territories according to ISO 13616 standard with zero dependencies.

## Essential Commands

### Development Workflow
```bash
# Setup
bun install                    # Install dependencies

# Development
bun run ts                     # TypeScript type checking
bun run lint                   # Biome lint + format check (biome check)
bun run lint:fix              # Biome with auto-fix (biome check --write)
bun test                      # Run tests
bun test --coverage           # Run tests with coverage

# Build
bun run build                 # Build package using zshy bundler
```

### Required Before Task Completion
Always run these commands in order before considering any task complete:
1. `bun run ts` - Must pass without TypeScript errors
2. `bun run lint` - Must pass Biome checks
3. `bun test` - All tests must pass
4. `bun run build` - Must build successfully

## Tech Stack & Tools

- **Runtime**: Bun (>= 1.2.17) - script and test runner. `package.json` declares `packageManager: pnpm@10.33.0` and the lockfile is `pnpm-lock.yaml`; CI (`.github/workflows/check.yml`) and the git hooks run `bun install` / `bun run ...`
- **Language**: TypeScript 5+ with strict mode enabled
- **Build**: zshy - custom bundler (dual ESM/CJS output)
- **Linting & Formatting**: Biome (`biome.json` extends `@nivalis/biome-config`)
- **Git Hooks**: Lefthook manages pre-commit linting and commit message validation
- **Testing**: Bun's built-in test runner with comprehensive IBAN validation tests

## Architecture

### Core Structure
```
src/
├── index.ts          # Main API exports - all public functions
├── specification.ts  # Core validation logic & ISO 7064 Mod 97-10 algorithm
├── countries.ts      # IBAN specifications for 110+ countries and territories
├── utils.ts          # Utility functions and regex patterns
└── index.spec.ts     # Comprehensive test suite
```

### Key Design Patterns
- **Pure Functions**: All exports are side-effect free with immutable operations
- **Factory Pattern**: `getCountry()` resolves country-specific validation rules
- **Strategy Pattern**: Each country implements its own IBAN validation strategy
- **Functional Style**: Preference for pure functions over classes

### Main API Functions
- `isValid(iban)` - Validates IBAN according to ISO 13616
- `validate(iban)` - Validates without throwing; returns `{ ok: true }` or `{ ok: false, error }` with a `ValidationError` code
- `describe(iban)` - Returns the country, electronic IBAN/BBAN and parsed BBAN blocks
- `electronicFormat(iban)` - Normalizes IBAN to electronic format
- `printFormat(iban, separator?)` - Formats IBAN for display
- `toBBAN(iban, separator?)` - Converts IBAN to BBAN
- `fromBBAN(countryCode, bban)` - Generates IBAN from BBAN
- `isValidBBAN(countryCode, bban)` - Validates country-specific BBAN
- `getCountry(countryCode)` - Returns the `Specification` of one country (throws for unknown codes)
- `availableCountries()` - Returns the frozen map of all country specifications

## Code Style & Conventions

### TypeScript Configuration
- ESNext target with strict mode and all strict flags enabled
- Uses bundler module resolution with path mapping (`@/*` → `./src/*`)
- No emit - types checked separately from build process

### Code Patterns
- **Error Handling**: Functions throw meaningful errors rather than returning null/undefined
- **String Processing**: Extensive use of `replaceAll()`, `slice()`, `toUpperCase()`
- **Type Safety**: Full TypeScript typing, no `any` types allowed
- **Naming**: camelCase functions, UPPER_SNAKE_CASE constants, PascalCase types

### Quality Standards
- Zero dependencies constraint must be maintained
- All public functions require JSDoc documentation
- Comprehensive test coverage for all IBAN validation scenarios
- Backward compatibility must be preserved

## Development Notes

### Git Workflow
- Pre-commit hooks (Lefthook) run `biome check --write` on staged files and `bun run ts`
- Commit messages validated using commitlint (conventional commits)
- CI pipeline runs full check suite on all pushes/PRs

### Build System
- Uses `zshy` bundler (configured via `package.json` zshy field)
- Outputs dual ESM (.js) and CJS (.cjs) builds with TypeScript definitions
- Package exports configured for both module systems

### Testing Strategy
- Uses Bun's built-in test runner
- Tests cover all supported countries and IBAN formats
- Includes edge cases, error handling, and type validation
- Test file: `src/index.spec.ts`

### Important Constraints
- Must maintain zero dependencies
- Must support both ESM and CJS consumers
- All changes must pass the 4-step validation process
- TypeScript strict mode compliance required