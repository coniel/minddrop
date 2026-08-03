import { describe, expect, it } from 'vitest';
import { resolvePropertyFilePath } from './resolvePropertyFilePath';

const base = {
  databasePath: '/db',
  propertyFilesDirName: 'Media',
  entryTitle: 'Entry',
  propertyName: 'Image',
  fileName: 'image.png',
};

describe('resolvePropertyFilePath', () => {
  it('resolves root storage to the database root', () => {
    expect(resolvePropertyFilePath({ ...base, mode: 'root' })).toBe(
      '/db/image.png',
    );
  });

  it('resolves common storage to the common directory', () => {
    expect(resolvePropertyFilePath({ ...base, mode: 'common' })).toBe(
      '/db/Media/image.png',
    );
  });

  it('resolves property storage to a per-property directory', () => {
    expect(resolvePropertyFilePath({ ...base, mode: 'property' })).toBe(
      '/db/Image/image.png',
    );
  });

  it('resolves entry storage to a per-entry directory', () => {
    expect(resolvePropertyFilePath({ ...base, mode: 'entry' })).toBe(
      '/db/Entry/image.png',
    );
  });
});
