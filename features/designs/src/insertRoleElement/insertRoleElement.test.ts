import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { isRoleElement } from '@minddrop/designs';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import {
  DesignStudioStore,
  createDesignStudioStore,
} from '../DesignStudioStore';
import { cleanup, setup } from '../test-utils';
import { insertRoleElement } from './insertRoleElement';

const { design_books, layout_card_1 } = DesignFixtures;

describe('insertRoleElement', () => {
  let studio: DesignStudioStore;

  beforeEach(() => {
    setup();

    // Open the books design with its card layout active
    studio = createDesignStudioStore();
    studio.initialize(design_books);
    studio.setActiveLayout(layout_card_1.id);
  });

  afterEach(cleanup);

  it('inserts an element playing the role', () => {
    insertRoleElement(studio, 'content', 'root', 0, layout_card_1.id);

    // The new element is the root's first child
    const root = studio.getDesignElement('root', layout_card_1.id);
    const insertedId = (root as { children: string[] }).children[0];
    const inserted = studio.getDesignElement(insertedId, layout_card_1.id);

    // It plays the role and uses the role's element type
    expect(isRoleElement(inserted) && inserted.role).toBe('content');
    expect(inserted.type).toBe('editor');
  });

  it('auto-binds the element to a compatible property', () => {
    insertRoleElement(studio, 'content', 'root', 0, layout_card_1.id);

    const root = studio.getDesignElement('root', layout_card_1.id);
    const insertedId = (root as { children: string[] }).children[0];
    const inserted = studio.getDesignElement(insertedId, layout_card_1.id);

    // The content role binds formatted text properties
    expect(inserted.property).toBe('Notes');
  });

  it('selects the inserted element', () => {
    insertRoleElement(studio, 'content', 'root', 0, layout_card_1.id);

    const root = studio.getDesignElement('root', layout_card_1.id);
    const insertedId = (root as { children: string[] }).children[0];

    expect(studio.getSelectedElementId()).toBe(insertedId);
  });

  it('does nothing when no design is open', () => {
    const emptyStudio = createDesignStudioStore();

    insertRoleElement(emptyStudio, 'content', 'root', 0);

    expect(emptyStudio.getDesign()).toBeNull();
  });
});
