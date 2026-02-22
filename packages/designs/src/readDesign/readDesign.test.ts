import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, design_card_1, setup } from '../test-utils';
import { getDesignFilePath } from '../utils';
import { readDesign } from './readDesign';

describe('readDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads the design from the file system', async () => {
    const design = await readDesign(getDesignFilePath(design_card_1.id));

    expect(design).toEqual(design_card_1);
  });

  it('returns null if the design does not exist', async () => {
    const design = await readDesign('non-existent-path');

    expect(design).toBeNull();
  });
});
