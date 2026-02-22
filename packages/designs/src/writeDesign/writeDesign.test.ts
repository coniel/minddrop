import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { omitPath, restoreDates } from '@minddrop/utils';
import { MockFs, cleanup, design_card_1, setup } from '../test-utils';
import { writeDesign } from './writeDesign';

describe('writeDesign', () => {
  beforeEach(() => setup({ loadDesignFiles: false }));

  afterEach(cleanup);

  it('writes the design to the file system', async () => {
    await writeDesign(design_card_1.id);

    expect(MockFs.exists(design_card_1.path)).toBe(true);
    expect(restoreDates(MockFs.readJsonFile(design_card_1.path))).toEqual(
      omitPath(design_card_1),
    );
  });
});
