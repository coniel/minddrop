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
    "@jest/types": "^27.2.5",
    "@types/node": "^16.11.6",
    "jest": "^27.3.1",
    "rimraf": "~3.0.2",
    "ts-jest": "^27.0.7",
    "ts-node": "^10.4.0",
    "typescript": "~4.4.4"
  },
  "dependencies": {}
}
