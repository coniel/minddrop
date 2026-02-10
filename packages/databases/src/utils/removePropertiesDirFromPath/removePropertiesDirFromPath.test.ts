import { describe, expect, it } from 'vitest';
import { removePropertiesDirFromPath } from './removePropertiesDirFromPath';

describe('removePropertiesDirFromPath', () => {
  it('removes the properties directory from the path', () => {
    expect(
      removePropertiesDirFromPath(
        '/Users/foo/Documents/MindDrop/test-database/properties/Test Entry.yaml',
      ),
    ).toEqual('/Users/foo/Documents/MindDrop/test-database/Test Entry.yaml');
  });

  it('does nothing if the properties directory is not present', () => {
    expect(
      removePropertiesDirFromPath(
        '/Users/foo/Documents/MindDrop/test-database/Test Entry.yaml',
      ),
    ).toEqual('/Users/foo/Documents/MindDrop/test-database/Test Entry.yaml');
    expect(
      removePropertiesDirFromPath(
        '/Users/foo/Documents/MindDrop/test-database/properties.yaml',
      ),
    ).toEqual('/Users/foo/Documents/MindDrop/test-database/properties.yaml');
  });
});
