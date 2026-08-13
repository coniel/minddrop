import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, setup } from '../test-utils';
import { writeMediaFile } from './writeMediaFile';

const mediaDirPath = 'path/to/media';

describe('writeMediaFile', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('writes the file into the media directory', async () => {
    const file = new File(['contents'], 'photo.png');

    const fileName = await writeMediaFile(mediaDirPath, file);

    expect(fileName).toMatch(/\.png$/);
    expect(MockFs.exists(`${mediaDirPath}/${fileName}`)).toBe(true);
  });
});
