import { describe, expect, it } from 'vitest';
import { getLogSource } from './getLogSource';

const ignorePattern = /startConsoleLogCapture/;

const v8Stack = [
  'Error',
  '    at captureConsoleLog (/src/startConsoleLogCapture.ts:20:15)',
  '    at Object.log (/node_modules/react-dom/react-dom.js:12:3)',
  '    at initializeDatabases (/src/initializeDatabases.ts:42:7)',
].join('\n');

const webKitStack = [
  'captureLog@/src/startConsoleLogCapture.ts:20:15',
  'initializeDatabases@/src/initializeDatabases.ts?t=1234:42:7',
].join('\n');

describe('getLogSource', () => {
  it('returns null without a stack', () => {
    expect(getLogSource(undefined, ignorePattern)).toBeNull();
  });

  it('returns the first frame outside the capturing code', () => {
    expect(getLogSource(v8Stack, ignorePattern)).toEqual({
      file: 'initializeDatabases.ts',
      line: 42,
    });
  });

  it('ignores bundler query strings in WebKit stacks', () => {
    expect(getLogSource(webKitStack, ignorePattern)).toEqual({
      file: 'initializeDatabases.ts',
      line: 42,
    });
  });

  it('skips third party frames', () => {
    const stack = [
      '    at log (/node_modules/some-package/index.js:5:1)',
      '    at renderView (/src/renderView.tsx:8:2)',
    ].join('\n');

    expect(getLogSource(stack, ignorePattern)).toEqual({
      file: 'renderView.tsx',
      line: 8,
    });
  });

  it('returns null when no frame has a source location', () => {
    expect(getLogSource('Error\n    at <anonymous>', ignorePattern)).toBeNull();
  });
});
