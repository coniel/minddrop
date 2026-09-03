import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignsStore } from '../DesignsStore';
import { DesignNotFoundError } from '../errors';
import { MockFs, cardDesign_1, cleanup, setup } from '../test-utils';
import { resolveDesignFilePath } from '../utils';
import { writeDesign } from './writeDesign';

describe('writeDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('writes the design to its file', async () => {
    // Change the design in the store without persisting
    DesignsStore.update(cardDesign_1.id, { name: 'Renamed' });

    await writeDesign(cardDesign_1.id);

    expect(MockFs.readJsonFile(resolveDesignFilePath(cardDesign_1.id))).toEqual(
      { ...cardDesign_1, name: 'Renamed' },
    );
  });

  it('creates the designs directory if it does not exist', async () => {
    // Empty the mock file system so the designs directory is missing
    MockFs.clear();

    await writeDesign(cardDesign_1.id);

    expect(MockFs.readJsonFile(resolveDesignFilePath(cardDesign_1.id))).toEqual(
      cardDesign_1,
    );
  });

  it('throws if the design does not exist', async () => {
    await expect(() => writeDesign('design_missing')).rejects.toThrow(
      DesignNotFoundError,
    );
  });
});
