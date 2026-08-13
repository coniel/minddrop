import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, setup } from '../test-utils';
import { addMediaFile } from './addMediaFile';

const mediaDirPath = 'path/to/media';

describe('addMediaFile', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('copies the source file into the media directory', async () => {
    // Create the source file
    MockFs.createDir('path/to', { recursive: true });
    MockFs.writeTextFile('path/to/photo.png', 'contents');

    const fileName = await addMediaFile(mediaDirPath, 'path/to/photo.png');

    expect(fileName).toMatch(/\.png$/);
    expect(MockFs.exists(`${mediaDirPath}/${fileName}`)).toBe(true);
  });
});
