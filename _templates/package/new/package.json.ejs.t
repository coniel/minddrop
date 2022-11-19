---
to: packages/<%= name %>/package.json
---
{
  "name": "@minddrop/<%= name %>",
  "version": "0.1.0",
  "main": "dist/index",
  "types": "dist/index",
  "files": [
    "dist"
  ],
  "scripts": {
    "dev": "tsc -p tsconfig.build.json --watch",
    "build": "yarn run clean && yarn run compile",
    "clean": "rimraf -rf ./dist",
    "compile": "tsc -p tsconfig.build.json",
    "prepublishOnly": "yarn run build",
    "test": "jest"
  },
  "devDependencies": {
    "@jest/types": "^29.3.1",
    "@types/node": "^16.11.6",
    "jest": "^29.3.1",
    "rimraf": "~3.0.2",
    "ts-jest": "^29.0.3",
    "ts-node": "^10.9.1",
    "typescript": "~4.9.3"
  },
  "dependencies": {}
}
