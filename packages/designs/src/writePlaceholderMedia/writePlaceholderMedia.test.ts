import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MockFs, cleanup, setup } from '../test-utils';
import { getPlaceholderMediaDirPath } from '../utils';
import { writeDesignPlaceholderMedia } from './writePlaceholderMedia';

const MOCK_UUID = 'test-uuid-5678';

vi.mock('@minddrop/utils', async () => {
  const actual = await vi.importActual('@minddrop/utils');

  return {
    ...actual,
    uuid: () => MOCK_UUID,
  };
});

function createFile(name: string, content = 'data'): File {
  return new File([content], name);
}

describe('writeDesignPlaceholderMedia', () => {
  beforeEach(() => {
    setup({ loadDesigns: false, loadDesignFiles: false });
  });

  afterEach(cleanup);

  it('creates the placeholder-media directory if it does not exist', async () => {
    const mediaDir = getPlaceholderMediaDirPath();

    expect(MockFs.exists(mediaDir)).toBe(false);

    await writeDesignPlaceholderMedia(createFile('photo.png'));

    expect(MockFs.exists(mediaDir)).toBe(true);
  });

  it('writes the file with a UUID name preserving the extension', async () => {
    const mediaDir = getPlaceholderMediaDirPath();

    const fileName = await writeDesignPlaceholderMedia(
      createFile('photo.jpg'),
    );

    expect(fileName).toBe(`${MOCK_UUID}.jpg`);
    expect(MockFs.exists(`${mediaDir}/${fileName}`)).toBe(true);
  });

  it('handles a file without an extension', async () => {
    const mediaDir = getPlaceholderMediaDirPath();

    const fileName = await writeDesignPlaceholderMedia(createFile('README'));

    expect(fileName).toBe(MOCK_UUID);
    expect(MockFs.exists(`${mediaDir}/${fileName}`)).toBe(true);
  });

  it('returns the generated file name', async () => {
    const result = await writeDesignPlaceholderMedia(
      createFile('image.webp'),
    );

    expect(result).toBe(`${MOCK_UUID}.webp`);
  });
});
