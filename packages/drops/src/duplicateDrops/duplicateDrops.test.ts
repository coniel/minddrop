import {
  setup,
  cleanup,
  core,
  drop1,
  drop2,
  dropConfig,
  TextDropData,
} from '../test-utils';
import { duplicateDrops } from './duplicateDrops';
import { doesNotContain } from '@minddrop/utils';
import { DropsResource } from '../DropsResource';

describe('duplicateDrops', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates new drops', () => {
    // The IDs of the original drops
    const originalDropIds = [drop1.id, drop2.id];

    // Duplicate a couple of drops
    const drops = duplicateDrops(core, originalDropIds);

    // Get the duplcaited drop IDs
    const duplicateDropIds = Object.keys(drops);

    // Duplicated drops should have new IDs
    expect(doesNotContain(originalDropIds, duplicateDropIds));

    // Duplciated drops should exist in the store
    expect(DropsResource.get(duplicateDropIds[0])).toEqual(
      drops[duplicateDropIds[0]],
    );
  });

  it('adds the `duplicatedFrom` property', () => {
    // Duplicate a drop
    const drops = duplicateDrops(core, [drop1.id]);

    // Duplcicated drop should have the original drop ID as its
    // 'duplicatedFrom' value.
    expect(Object.values(drops)[0].duplicatedFrom).toBe(drop1.id);
  });

  it('merges in the type config `duplicateData` data', () => {
    // Register a drop type with a `duplicateData` callback
    DropsResource.register(core, {
      ...dropConfig,
      type: 'with-duplicate-data',
      duplicateData: () => ({ text: 'Duplicated text' }),
    });

    // Create a drop of the type registered above
    const drop = DropsResource.create(core, 'with-duplicate-data', {
      text: 'Original text',
    });

    // Duplicate the drop creatd above
    const duplicates = duplicateDrops<TextDropData>(core, [drop.id]);

    // Duplicate drop should contain the `duplciateData` data
    expect(Object.values(duplicates)[0].text).toBe('Duplicated text');
  });
});
