import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  propertyStorageDatabase,
  propertyStorageEntry1,
  setup,
} from '../../test-utils';
import { resolveIncrementalPropertyFilePath } from './resolveIncrementalPropertyFilePath';

describe('resolveIncrementalPropertyFilePath', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the property file path when no conflicting file exists', async () => {
    // No photo.png exists in the property directory
    const result = await resolveIncrementalPropertyFilePath(
      propertyStorageEntry1.id,
      'Image',
      'photo.png',
    );

    expect(result.path).toBe(`${propertyStorageDatabase.path}/Image/photo.png`);
    expect(result.increment).toBeUndefined();
  });

  it('increments the file name when a conflicting file exists', async () => {
    // The fixtures place an image.png in the property directory
    const result = await resolveIncrementalPropertyFilePath(
      propertyStorageEntry1.id,
      'Image',
      'image.png',
    );

    expect(result.path).toBe(
      `${propertyStorageDatabase.path}/Image/image 1.png`,
    );
    expect(result.increment).toBe(1);
  });
});
