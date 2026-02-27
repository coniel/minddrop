import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MockFs, cleanup, setup } from '../test-utils';
import { getPlaceholderMediaDirPath } from '../utils';
import { addDesignPlaceholderMedia } from './addPlaceholderMedia';

const MOCK_UUID = 'test-uuid-1234';

vi.mock('@minddrop/utils', async () => {
  const actual = await vi.importActual('@minddrop/utils');

  return {
    ...actual,
    uuid: () => MOCK_UUID,
  };
});

describe('addDesignPlaceholderMedia', () => {
  beforeEach(() => {
    setup({ loadDesigns: false, loadDesignFiles: false });
  });

  afterEach(cleanup);

  it('creates the placeholder-media directory if it does not exist', async () => {
    const mediaDir = getPlaceholderMediaDirPath();

    expect(MockFs.exists(mediaDir)).toBe(false);

    const sourcePath = `${mediaDir}/source.png`;
    MockFs.addFiles([sourcePath]);
    await addDesignPlaceholderMedia(sourcePath);

    expect(MockFs.exists(mediaDir)).toBe(true);
  });

  it('copies the file with a UUID name preserving the extension', async () => {
    const sourcePath = 'workspace/photo.jpg';
    MockFs.addFiles([sourcePath]);

    const fileName = await addDesignPlaceholderMedia(sourcePath);

    expect(fileName).toBe(`${MOCK_UUID}.jpg`);

    const mediaDir = getPlaceholderMediaDirPath();
    expect(MockFs.exists(`${mediaDir}/${fileName}`)).toBe(true);
  });

  it('handles files without an extension', async () => {
    const sourcePath = 'workspace/README';
    MockFs.addFiles([sourcePath]);

    const fileName = await addDesignPlaceholderMedia(sourcePath);

    expect(fileName).toBe(MOCK_UUID);

    const mediaDir = getPlaceholderMediaDirPath();
    expect(MockFs.exists(`${mediaDir}/${fileName}`)).toBe(true);
  });

  it('returns the generated file name', async () => {
    const sourcePath = 'workspace/image.webp';
    MockFs.addFiles([sourcePath]);

    const result = await addDesignPlaceholderMedia(sourcePath);

    expect(result).toBe(`${MOCK_UUID}.webp`);
  });
});
