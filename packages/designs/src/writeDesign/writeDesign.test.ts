import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidParameterError, omitPath } from '@minddrop/utils';
import { DefaultCardDesign } from '../default-designs';
import { MockFs, cleanup, design_card_1, setup } from '../test-utils';
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

    expect(MockFs.exists(design_card_1.path)).toBe(true);
    expect(MockFs.readJsonFile(design_card_1.path)).toEqual(
      omitPath(design_card_1),
    );
  });
});
