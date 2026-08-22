import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TextElementConfig } from '@minddrop/designs';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { cleanup, setup } from '../test-utils';
import { FlatContainerDesignElement } from '../types';
import {
  DesignStudioStore,
  createDesignStudioStore,
} from './DesignStudioStore';

const { design_books, layout_page_1 } = DesignFixtures;

describe('page panels', () => {
  let studio: DesignStudioStore;

  beforeEach(() => {
    setup();

    // Initialize a store instance with the page layout active
    studio = createDesignStudioStore();
    studio.initialize(design_books);
    studio.setActiveLayout(layout_page_1.id);
  });

  afterEach(cleanup);

  /**
   * Returns the active page root's flat element.
   */
  function getRoot(): FlatContainerDesignElement {
    return studio.getElements(layout_page_1.id)
      .root as unknown as FlatContainerDesignElement;
  }

  it('enables a panel, wrapping content into a content region', () => {
    const contentBefore = getRoot().children;

    studio.addPagePanel('left');

    const elements = studio.getElements(layout_page_1.id);
    const root = getRoot();

    // The root now holds a panel and a content region
    const panel = root.children
      .map((childId) => elements[childId])
      .find((child) => child.type === 'page-panel');
    const content = root.children
      .map((childId) => elements[childId])
      .find(
        (child) =>
          child.type === 'container' &&
          'role' in child &&
          child.role === 'page-content',
      );

    expect(panel).toBeDefined();
    expect(content).toBeDefined();

    // The original content moved into the content region
    expect((content as FlatContainerDesignElement).children).toEqual(
      contentBefore,
    );
  });

  it('disables a panel, unwrapping the content region', () => {
    const contentBefore = getRoot().children;

    // Enable then disable the panel
    studio.addPagePanel('left');
    studio.removePagePanel('left');

    // The root is back to its original free-form children
    expect(getRoot().children).toEqual(contentBefore);
  });

  it('rejects new elements dropped directly into the panel row', () => {
    studio.addPagePanel('left');

    const childrenBefore = getRoot().children;

    // Attempt to add an element directly to the panelled root
    studio.addDesignElementFromTemplate(TextElementConfig.template, 'root', 0);

    // The panel row is unchanged
    expect(getRoot().children).toEqual(childrenBefore);
  });

  it('disables a panel when deleting it', () => {
    studio.addPagePanel('left');

    const elements = studio.getElements(layout_page_1.id);
    const panelId = getRoot().children.find(
      (childId) => elements[childId].type === 'page-panel',
    )!;

    // Highlight and delete the panel
    studio.selectElement(panelId);
    studio.deleteHighlightedElement();

    // The panel is removed and the content region unwrapped
    const rootAfter = getRoot();
    const elementsAfter = studio.getElements(layout_page_1.id);

    expect(
      rootAfter.children.some(
        (childId) => elementsAfter[childId]?.type === 'page-panel',
      ),
    ).toBe(false);
  });

  it('protects the content region from deletion', () => {
    studio.addPagePanel('left');

    const elements = studio.getElements(layout_page_1.id);
    const contentId = getRoot().children.find((childId) => {
      const child = elements[childId];

      return (
        child.type === 'container' &&
        'role' in child &&
        child.role === 'page-content'
      );
    })!;

    // Highlight and attempt to delete the content region
    studio.selectElement(contentId);
    studio.deleteHighlightedElement();

    // The content region survives
    expect(studio.getElements(layout_page_1.id)[contentId]).toBeDefined();
  });
});
