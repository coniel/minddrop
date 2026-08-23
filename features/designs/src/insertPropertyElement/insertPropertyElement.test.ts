import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { isPropertyElement } from '@minddrop/designs';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import {
  DesignStudioStore,
  createDesignStudioStore,
} from '../DesignStudioStore';
import { cleanup, setup } from '../test-utils';
import { insertPropertyElement } from './insertPropertyElement';

const { design_books, layout_card_1 } = DesignFixtures;

describe('insertPropertyElement', () => {
  let studio: DesignStudioStore;

  beforeEach(() => {
    setup();

    // Open the books design with its card layout active
    studio = createDesignStudioStore();
    studio.initialize(design_books);
    studio.setActiveLayout(layout_card_1.id);
  });

  afterEach(cleanup);

  it('inserts an element for the property type', () => {
    insertPropertyElement(studio, 'text', 'root', 0, layout_card_1.id);

    // The new element is the root's first child
    const root = studio.getDesignElement('root', layout_card_1.id);
    const insertedId = (root as { children: string[] }).children[0];
    const inserted = studio.getDesignElement(insertedId, layout_card_1.id);

    // It is a property element persisting its property type
    expect(isPropertyElement(inserted)).toBe(true);
    expect(isPropertyElement(inserted) && inserted.propertyType).toBe('text');
  });

  it('auto-binds the element to a compatible property', () => {
    insertPropertyElement(studio, 'text', 'root', 0, layout_card_1.id);

    const root = studio.getDesignElement('root', layout_card_1.id);
    const insertedId = (root as { children: string[] }).children[0];
    const inserted = studio.getDesignElement(insertedId, layout_card_1.id);

    // 'Subtitle' is the design's first text property
    expect(inserted.property).toBe('Subtitle');
  });

  it('selects the inserted element', () => {
    insertPropertyElement(studio, 'text', 'root', 0, layout_card_1.id);

    const root = studio.getDesignElement('root', layout_card_1.id);
    const insertedId = (root as { children: string[] }).children[0];

    expect(studio.getSelectedElementId()).toBe(insertedId);
  });

  it('does nothing when no design is open', () => {
    const emptyStudio = createDesignStudioStore();

    insertPropertyElement(emptyStudio, 'text', 'root', 0);

    expect(emptyStudio.getDesign()).toBeNull();
  });
});
