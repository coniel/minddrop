import { describe, expect, it } from 'vitest';
import { Paths } from '@minddrop/utils';
import { MetadataFileName } from '../../constants';
import { databaseMetadataFilePath } from './databaseMetadataFilePath';

describe('databaseMetadataFilePath', () => {
  it('returns the path to the metadata file', () => {
    const databasePath = '/workspace/Books';

    expect(databaseMetadataFilePath(databasePath)).toBe(
      `${databasePath}/${Paths.hiddenDirName}/${MetadataFileName}`,
    );
  });
});
