import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Paths } from '@minddrop/utils';
import { resolveFileSrc } from './resolveFileSrc';

describe('resolveFileSrc', () => {
  beforeEach(() => {
    // Set the file server host
    Paths.httpServerHost = 'http://localhost:1234';
  });

  afterEach(() => {
    // Clear the file server host
    Paths.httpServerHost = '';
  });

  it('returns null without a path', () => {
    expect(resolveFileSrc(null)).toBeNull();
    expect(resolveFileSrc('')).toBeNull();
  });

  it('serves the file from the file server, encoding the path', () => {
    expect(resolveFileSrc('/workspace/my file.png')).toBe(
      'http://localhost:1234/files?path=%2Fworkspace%2Fmy%20file.png',
    );
  });
});
