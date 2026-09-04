import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { TextElement } from '../design-element-configs';
import { DesignPropertyRenamedEvent } from '../events';
import { getDesign } from '../getDesign';
import { getLayoutPropertyBindings } from '../getLayoutPropertyBindings';
import { DesignFixtures, cleanup, setup } from '../test-utils';
import { updateLayout } from '../updateLayout';
import { renameDesignProperty } from './renameDesignProperty';

const { design_books, layout_card_1, element_text_1 } = DesignFixtures;

describe('renameDesignProperty', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('renames the property on the design', async () => {
    await renameDesignProperty(design_books.id, 'Subtitle', 'Tagline');

    const design = getDesign(design_books.id);

    expect(
      design.type === 'database' &&
        design.properties.some((property) => property.name === 'Tagline'),
    ).toBe(true);
  });

  it('rebinds layout elements bound to the property', async () => {
    // Bind an element in the design's card layout to the property
    const boundElement: TextElement = {
      ...element_text_1,
      id: 'bound-element',
      property: 'Subtitle',
    };

    await updateLayout(layout_card_1.id, {
      tree: {
        ...layout_card_1.tree,
        children: [boundElement],
      },
    });

    await renameDesignProperty(design_books.id, 'Subtitle', 'Tagline');

    // The binding must point at the new name
    const design = getDesign(design_books.id);
    const layout = design.layouts.find(
      (candidate) => candidate.id === layout_card_1.id,
    )!;

    expect(getLayoutPropertyBindings(layout)).toEqual({
      'bound-element': 'Tagline',
    });
  });

  it('throws when the new name collides with another property', async () => {
    await expect(
      renameDesignProperty(design_books.id, 'Subtitle', 'Title'),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('dispatches a property renamed event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DesignPropertyRenamedEvent, 'test', (payload) => {
        expect(payload.oldName).toBe('Subtitle');
        expect(payload.newName).toBe('Tagline');
        done();
      });

      renameDesignProperty(design_books.id, 'Subtitle', 'Tagline');
    }));
});
