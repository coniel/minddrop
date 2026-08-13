import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, setup } from '../../test-utils';
import { generateMediaFileName } from './generateMediaFileName';

describe('generateMediaFileName', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('preserves the source file extension', () => {
    expect(generateMediaFileName('path/to/photo.png')).toMatch(/\.png$/);
  });

  it('omits the extension for extensionless sources', () => {
    expect(generateMediaFileName('photo')).not.toContain('.');
  });

  it('generates unique names for the same source', () => {
    expect(generateMediaFileName('photo.png')).not.toBe(
      generateMediaFileName('photo.png'),
    );
  });
});
