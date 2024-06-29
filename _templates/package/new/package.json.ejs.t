---
to: <%= module %>/<%= name %>/package.json
---
{
  "name": "@minddrop/<%= name %>",
  "version": "0.0.0",
  "main": "src/index",
  "types": "src/index",
  "scripts": {
    "lint": "eslint ./**/*.ts*",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit --jsx react-jsx"
  },
  "devDependencies": {
    "eslint": "^8.39.0",
    "eslint-config-custom": "workspace:*",
    "tsconfig": "workspace:*",
    "typescript": "^5.0.4"
  }
}
