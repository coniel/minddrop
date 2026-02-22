import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidParameterError } from '@minddrop/utils';
import { DefaultCardDesign } from '../default-designs';
import { MockFs, cleanup, design_card_1, setup } from '../test-utils';
import { getDesignFilePath } from '../utils';
import { writeDesign } from './writeDesign';

describe('writeDesign', () => {
  beforeEach(() => setup({ loadDesignFiles: false }));

  afterEach(cleanup);

  it('prevents writing default designs', async () => {
    await expect(() => writeDesign(DefaultCardDesign.id)).rejects.toThrow(
      InvalidParameterError,
    );
  });

  it('writes the design to the file system', async () => {
    await writeDesign(design_card_1.id);

    expect(MockFs.readJsonFile(getDesignFilePath(design_card_1.id))).toEqual(
      design_card_1,
    );
  });
});
