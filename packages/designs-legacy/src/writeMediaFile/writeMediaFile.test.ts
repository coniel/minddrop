import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MockFs, cleanup, mockDate, setup } from '../test-utils';
import { resolveDesignMediaDirPath } from '../utils';
import { writeMediaFile } from './writeMediaFile';

const MOCK_UUID = 'test-uuid-5678';
const MOCK_BASE_NAME = `${mockDate.getTime()}-${MOCK_UUID}`;

vi.mock('@minddrop/utils', async () => {
  const actual = await vi.importActual('@minddrop/utils');

  return {
    ...actual,
    uuid: () => MOCK_UUID,
  };
});

describe('writeMediaFile', () => {
  beforeEach(() => setup({ loadDesigns: false, loadDesignFiles: false }));

  afterEach(cleanup);

  it('creates the media directory if it does not exist', async () => {
    const mediaDir = resolveDesignMediaDirPath('design_1');

    expect(MockFs.exists(mediaDir)).toBe(false);

    await writeMediaFile(mediaDir, createFile('photo.png'));

    expect(MockFs.exists(mediaDir)).toBe(true);
  });

  it('writes the file under a generated media file name', async () => {
    const mediaDir = resolveDesignMediaDirPath('design_1');

    const fileName = await writeMediaFile(mediaDir, createFile('photo.jpg'));

    expect(fileName).toBe(`${MOCK_BASE_NAME}.jpg`);
    expect(MockFs.exists(`${mediaDir}/${fileName}`)).toBe(true);
  });

  it('handles a file without an extension', async () => {
    const mediaDir = resolveDesignMediaDirPath('design_1');

    const fileName = await writeMediaFile(mediaDir, createFile('README'));

    expect(fileName).toBe(MOCK_BASE_NAME);
    expect(MockFs.exists(`${mediaDir}/${fileName}`)).toBe(true);
  });
});

function createFile(name: string, content = 'data'): File {
  return new File([content], name);
}
