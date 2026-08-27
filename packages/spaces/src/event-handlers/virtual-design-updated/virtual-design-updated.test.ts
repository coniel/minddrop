import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Design } from '@minddrop/designs';
import { SpacesStore } from '../../SpacesStore';
import {
  MockFs,
  cleanup,
  setup,
  spaceLayout_2,
  space_1,
} from '../../test-utils';
import { resolveSpaceFilePath } from '../../utils';
import { onUpdateVirtualDesign } from './virtual-design-updated';

// The space's design as it appears in the designs store
const baseDesign: Design = {
  ...space_1.design,
  virtual: true,
  created: new Date(),
  lastModified: new Date(),
};

describe('onUpdateVirtualDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('does nothing for non-virtual designs', async () => {
    const bundleDesign: Design = {
      ...baseDesign,
      virtual: undefined,
      owner: undefined,
    };

    await onUpdateVirtualDesign({
      original: bundleDesign,
      updated: { ...bundleDesign, layouts: [spaceLayout_2] },
    });

    // The space should remain unchanged
    expect(SpacesStore.get(space_1.id)).toEqual(space_1);
  });

  it('does nothing for designs not owned by a space', async () => {
    const databaseOwnedDesign: Design = {
      ...baseDesign,
      owner: 'database_some-database',
    };

    await onUpdateVirtualDesign({
      original: databaseOwnedDesign,
      updated: { ...databaseOwnedDesign, layouts: [spaceLayout_2] },
    });

    // The space should remain unchanged
    expect(SpacesStore.get(space_1.id)).toEqual(space_1);
  });

  it('does nothing if the owning space does not exist', async () => {
    const unknownOwnerDesign: Design = {
      ...baseDesign,
      owner: 'space_unknown',
    };

    // Should not throw
    await onUpdateVirtualDesign({
      original: unknownOwnerDesign,
      updated: { ...unknownOwnerDesign, layouts: [spaceLayout_2] },
    });
  });

  it('persists the updated design into the space', async () => {
    await onUpdateVirtualDesign({
      original: baseDesign,
      updated: { ...baseDesign, layouts: [spaceLayout_2] },
    });

    // The space should hold the updated owner-persisted design data
    const space = SpacesStore.get(space_1.id)!;

    expect(space.design).toEqual({
      ...space_1.design,
      layouts: [spaceLayout_2],
    });

    // The updated space should be written to the file system
    expect(MockFs.readJsonFile(resolveSpaceFilePath(space_1.id))).toEqual(
      space,
    );
  });
});
