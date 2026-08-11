import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MockFs, cleanup, mockDate, setup } from '../test-utils';
import { resolveDesignMediaDirPath } from '../utils';
import { addMediaFile } from './addMediaFile';

const MOCK_UUID = 'test-uuid-1234';
const MOCK_BASE_NAME = `${mockDate.getTime()}-${MOCK_UUID}`;
const SOURCE_DIR = 'workspace/source';

vi.mock('@minddrop/utils', async () => {
  const actual = await vi.importActual('@minddrop/utils');

  return {
    ...actual,
    uuid: () => MOCK_UUID,
  };
});

describe('addMediaFile', () => {
  beforeEach(() => {
    setup({ loadDesigns: false, loadDesignFiles: false });
    MockFs.addFiles([`${SOURCE_DIR}/photo.jpg`, `${SOURCE_DIR}/README`]);
  });

  afterEach(cleanup);

  it('creates the media directory if it does not exist', async () => {
    const mediaDir = resolveDesignMediaDirPath('design_1');

    expect(MockFs.exists(mediaDir)).toBe(false);

    await addMediaFile(mediaDir, `${SOURCE_DIR}/photo.jpg`);

    expect(MockFs.exists(mediaDir)).toBe(true);
  });

  it('copies the file under a generated media file name', async () => {
    const mediaDir = resolveDesignMediaDirPath('design_1');

    const fileName = await addMediaFile(mediaDir, `${SOURCE_DIR}/photo.jpg`);

    expect(fileName).toBe(`${MOCK_BASE_NAME}.jpg`);
    expect(MockFs.exists(`${mediaDir}/${fileName}`)).toBe(true);
  });

  it('handles a source file without an extension', async () => {
    const mediaDir = resolveDesignMediaDirPath('design_1');

    const fileName = await addMediaFile(mediaDir, `${SOURCE_DIR}/README`);

    expect(fileName).toBe(MOCK_BASE_NAME);
    expect(MockFs.exists(`${mediaDir}/${fileName}`)).toBe(true);
  });
});
