import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs-legacy/test-utils';
import { getDatabase } from '../../getDatabase';
import { cleanup, objectDatabase, setup } from '../../test-utils';
import { updateDatabase } from '../../updateDatabase';
import { onRenameDesignProperty } from './design-property-renamed';

const { design_cards } = DesignFixtures;

describe('onRenameDesignProperty', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('remaps design property map keys for databases using the design', async () => {
    // Give the database a design property map keyed by design property name
    await updateDatabase(objectDatabase.id, {
      designPropertyMap: { Title: 'Content', Cover: 'Icon' },
    });

    // Rename the 'Title' design property to 'Heading'
    await onRenameDesignProperty({
      design: design_cards,
      oldName: 'Title',
      newName: 'Heading',
    });

    // The matching key should be renamed, its value and other entries kept
    expect(getDatabase(objectDatabase.id).designPropertyMap).toEqual({
      Heading: 'Content',
      Cover: 'Icon',
    });
  });

  it('does not touch databases that use a different design', async () => {
    await updateDatabase(objectDatabase.id, {
      designPropertyMap: { Title: 'Content' },
    });

    // Rename a property on a design the database does not use
    await onRenameDesignProperty({
      design: { ...design_cards, id: 'design_other' },
      oldName: 'Title',
      newName: 'Heading',
    });

    // The design property map should be unchanged
    expect(getDatabase(objectDatabase.id).designPropertyMap).toEqual({
      Title: 'Content',
    });
  });

  it('does nothing when the renamed property is not in the map', async () => {
    await updateDatabase(objectDatabase.id, {
      designPropertyMap: { Title: 'Content' },
    });

    await onRenameDesignProperty({
      design: design_cards,
      oldName: 'Cover',
      newName: 'Image',
    });

    expect(getDatabase(objectDatabase.id).designPropertyMap).toEqual({
      Title: 'Content',
    });
  });
});
