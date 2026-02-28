# Creating Feature Packages

Feature packages live in `features/<name>/`. Below is the standard boilerplate.

## Directory structure

```
features/<name>/
├── package.json
├── tsconfig.json
├── eslint.config.js
├── vitest.config.ts
└── src/
    └── index.ts
```

## package.json

```json
{
  "name": "@minddrop/feature-<name>",
  "version": "0.0.0",
  "main": "src/index",
  "types": "src/index",
  "scripts": {
    "lint": "eslint .  --max-warnings 0",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit --jsx react-jsx"
  },
  "devDependencies": {
    "eslint": "^9.39.3",
    "@minddrop/eslint-config": "workspace:*",
    "tsconfig": "workspace:*",
    "typescript": "^5.9.3"
  }
}
```

Add `dependencies` as needed using `"workspace:*"` for internal packages.

## tsconfig.json

```json
{
  "extends": "tsconfig/react-library.json",
  "include": ["."],
  "exclude": ["node_modules"]
}
```

## eslint.config.js

```js
import { config } from '@minddrop/eslint-config/react-internal';

/** @type {import("eslint").Linter.Config} */
export default config;
```

## vitest.config.ts

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
  },
});
```

## src/index.ts

Empty placeholder or re-exports.

## After creating

1. Run `pnpm i` from the repo root to register the new workspace package.
2. Run `npx prettier --write` on all created files.
