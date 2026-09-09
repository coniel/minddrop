import { describe, expect, it } from 'vitest';
import { objectDatabase } from '../../test-utils';
import { serializeDatabase } from './serializeDatabase';

describe('serializeDatabase', () => {
  it('strips the derived fields', () => {
    const stored = serializeDatabase(objectDatabase);

    expect(stored).not.toHaveProperty('path');
    expect(stored).not.toHaveProperty('name');
  });

  it('keeps the stored fields', () => {
    const { path: _path, name: _name, ...stored } = objectDatabase;

    expect(serializeDatabase(objectDatabase)).toEqual(stored);
  });
});
