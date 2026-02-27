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

describe('writeDesignPlaceholderMedia', () => {
  beforeEach(() => {
    setup({ loadDesigns: false, loadDesignFiles: false });
  });

  afterEach(cleanup);

  it('creates the placeholder-media directory if it does not exist', async () => {
    const mediaDir = getPlaceholderMediaDirPath();

    expect(MockFs.exists(mediaDir)).toBe(false);

    await writeDesignPlaceholderMedia(new Blob(['test']), 'png');

    expect(MockFs.exists(mediaDir)).toBe(true);
  });

  it('writes the file with a UUID name and the given extension', async () => {
    const mediaDir = getPlaceholderMediaDirPath();
    const file = new Blob(['image data']);

    const fileName = await writeDesignPlaceholderMedia(file, 'jpg');

    expect(fileName).toBe(`${MOCK_UUID}.jpg`);
    expect(MockFs.exists(`${mediaDir}/${fileName}`)).toBe(true);
  });

  it('handles an empty extension', async () => {
    const mediaDir = getPlaceholderMediaDirPath();
    const file = new Blob(['data']);

    const fileName = await writeDesignPlaceholderMedia(file, '');

    expect(fileName).toBe(MOCK_UUID);
    expect(MockFs.exists(`${mediaDir}/${fileName}`)).toBe(true);
  });

  it('returns the generated file name', async () => {
    const result = await writeDesignPlaceholderMedia(new Blob(['test']), 'webp');

    expect(result).toBe(`${MOCK_UUID}.webp`);
  });
});
