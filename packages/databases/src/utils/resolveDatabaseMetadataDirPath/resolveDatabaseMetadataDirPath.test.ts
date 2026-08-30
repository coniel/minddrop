import { describe, expect, it } from 'vitest';
import { resolveDatabaseMetadataDirPath } from './resolveDatabaseMetadataDirPath';

describe('resolveDatabaseMetadataDirPath', () => {
  it('returns the metadata directory inside the hidden directory', () => {
    expect(resolveDatabaseMetadataDirPath('/workspace/Objects')).toBe(
      '/workspace/Objects/.minddrop/metadata',
    );
  });
});
