# Accessibility Testing System

## Overview
This project sets up automated accessibility testing for a Rails app using Cypress, axe-core, and a route extractor.

- **route_extractor.ts**: TypeScript script to extract routes from Rails app.
- **Cypress Tests**: In `cypress/e2e/accessibility.cy.ts`, imports routes and checks accessibility.
- **Reports**: Generated in `/reports` via mochawesome.

## Prerequisites
- Node.js and npm installed.
- Ruby and Rails installed (for the sample app).
- TypeScript installed globally (`npm install -g typescript`).

## Setup
1. **Rails App**: The sample app is in `../test_rails_app`. Start it:
   ```
   cd ../test_rails_app
   rails server
   ```

2. **Compile and Run Extractor**:
   ```
   cd /Users/ale/workspace/tim508
   tsc route_extractor.ts
   node route_extractor.js
   ```
   - This generates `routes.ts` in `test_rails_app`.

3. **Copy to Cypress**:
   ```
   cp ../test_rails_app/routes.ts .
   ```

## Running Tests
- Headless (generates reports):
  ```
  npx cypress run
  ```
- GUI:
  ```
  npx cypress open
  ```

## One-Line Run
Compile, extract, copy, and test:
```
cd /Users/ale/workspace/tim508 && tsc route_extractor.ts && node route_extractor.js && cp test_rails_app/routes.ts cypress_accessibility_tester/ && cd cypress_accessibility_tester && npx cypress run
```

## Customization
- Update `route_extractor.ts` for your Rails paths.
- Add auth handling in Cypress commands if needed.
- View reports in `/reports`.
