import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignElementTemplate, TextElementConfig } from '@minddrop/designs';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { DropEventData } from '@minddrop/selection';
import {
  DesignStudioStore,
  createDesignStudioStore,
} from '../DesignStudioStore';
import {
  DesignElementTemplatesDataKey,
  DesignElementsDataKey,
} from '../constants';
import { cleanup, setup } from '../test-utils';
import { DesignStudioDropEventData, FlatParentDesignElement } from '../types';
import { handleDropOnGap } from './handleDropOnGap';

const {
  design_books,
  designProperties,
  layout_card_1,
  element_container_1,
  element_text_1,
  element_text_2,
  element_text_3,
} = DesignFixtures;

// The container holding a single child, mirroring a nested branch
const containerElement = { ...element_container_1, children: [element_text_3] };

// A layout whose root holds a leaf, a container, and a second leaf,
// giving three sortable root children plus a nested child
const testLayout = {
  ...layout_card_1,
  tree: {
    ...layout_card_1.tree,
    children: [element_text_1, containerElement, element_text_2],
  },
};

const testDesign = { ...design_books, layouts: [testLayout] };

// The root's children in their initial order
const children = [element_text_1.id, containerElement.id, element_text_2.id];

const baseEvent = {
  data: {
    [DesignElementsDataKey]: [],
    [DesignElementTemplatesDataKey]: [],
  },
  index: 1,
  position: 'inside',
  targetId: 'root',
  targetType: 'flex-drop-container',
  event: new Event('drop'),
} as unknown as DropEventData<DesignStudioDropEventData>;

describe('handleDropOnGap', () => {
  let studio: DesignStudioStore;

  beforeEach(() => {
    setup();

    // Each test gets its own store instance holding the test design
    studio = createDesignStudioStore();
    studio.initialize(testDesign, designProperties);
    studio.setActiveLayout(testLayout.id);
  });

  afterEach(cleanup);

  /**
   * Returns the current children of the layout's root element.
   */
  function getChildren(): string[] {
    return studio.getDesignElement<FlatParentDesignElement>('root').children;
  }

  /**
   * Returns the current children of the layout's container element.
   */
  function getContainerChildren(): string[] {
    return studio.getDesignElement<FlatParentDesignElement>(containerElement.id)
      .children;
  }

  describe('invalid drop', () => {
    it('does nothing', () => {
      expect(() =>
        handleDropOnGap(studio, {} as DropEventData, 'root', 1),
      ).not.toThrow();

      expect(getChildren()).toEqual(children);
    });
  });

  describe('dropped template', () => {
    it('adds an element from a template at the target index', () => {
      // Children with a new element inserted at index 1
      const childrenWithNewElement = [...children];
      childrenWithNewElement.splice(1, 0, expect.any(String));

      const drop: DropEventData<DesignStudioDropEventData> = {
        ...baseEvent,
        data: {
          [DesignElementTemplatesDataKey]: [
            TextElementConfig.template as DesignElementTemplate,
          ],
        },
      };

      handleDropOnGap(studio, drop, 'root', 1);

      expect(getChildren()).toEqual(childrenWithNewElement);
    });

    it('adds an element from a template into a nested container', () => {
      const drop: DropEventData<DesignStudioDropEventData> = {
        ...baseEvent,
        data: {
          [DesignElementTemplatesDataKey]: [
            TextElementConfig.template as DesignElementTemplate,
          ],
        },
      };

      handleDropOnGap(studio, drop, containerElement.id, 0);

      // The new element leads the container's children
      expect(getContainerChildren()).toEqual([
        expect.any(String),
        element_text_3.id,
      ]);
      // The root's children are unchanged
      expect(getChildren()).toEqual(children);
    });
  });

  describe('dropped element', () => {
    describe('ignored drops', () => {
      it('does nothing if an element is dropped onto the gap preceding it', () => {
        // Drop the element at index 1 into gap 1, which is before it
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          index: 1,
          data: {
            [DesignElementsDataKey]: [
              studio.getDesignElement(containerElement.id),
            ],
          },
        };

        handleDropOnGap(studio, drop, 'root', 1);

        // Should not change the children
        expect(getChildren()).toEqual(children);
      });

      it('does nothing if a container is dropped into itself', () => {
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          data: {
            [DesignElementsDataKey]: [
              studio.getDesignElement(containerElement.id),
            ],
          },
        };

        handleDropOnGap(studio, drop, containerElement.id, 0);

        // Should not change the children
        expect(getChildren()).toEqual(children);
        expect(getContainerChildren()).toEqual([element_text_3.id]);
      });

      it('does nothing if an element is dropped onto the gap following it', () => {
        // Drop the element at index 1 into gap 2, which is after it
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          index: 1,
          data: {
            [DesignElementsDataKey]: [
              studio.getDesignElement(containerElement.id),
            ],
          },
        };

        handleDropOnGap(studio, drop, 'root', 2);

        // Should not change the children
        expect(getChildren()).toEqual(children);
      });
    });

    describe('drops from a different parent', () => {
      it('moves an element from a different parent to the target index', () => {
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          data: {
            [DesignElementsDataKey]: [
              studio.getDesignElement(element_text_3.id),
            ],
          },
        };

        handleDropOnGap(studio, drop, 'root', 1);

        expect(getChildren()).toEqual([
          element_text_1.id,
          element_text_3.id,
          containerElement.id,
          element_text_2.id,
        ]);
        // The element left its original parent
        expect(getContainerChildren()).toEqual([]);
      });

      it('moves an element from a different parent into a nested container', () => {
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          data: {
            [DesignElementsDataKey]: [
              studio.getDesignElement(element_text_2.id),
            ],
          },
        };

        handleDropOnGap(studio, drop, containerElement.id, 0);

        // The dropped element leads the container's children
        expect(getContainerChildren()).toEqual([
          element_text_2.id,
          element_text_3.id,
        ]);
        // And left the root
        expect(getChildren()).toEqual([element_text_1.id, containerElement.id]);
      });
    });

    describe('drops within the same parent', () => {
      it('moves an element from a larger index to a smaller index', () => {
        // Drop the element at index 2 into gap 1
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          data: {
            [DesignElementsDataKey]: [
              studio.getDesignElement(element_text_2.id),
            ],
          },
        };

        handleDropOnGap(studio, drop, 'root', 1);

        expect(getChildren()).toEqual([
          element_text_1.id,
          element_text_2.id,
          containerElement.id,
        ]);
      });

      it('moves an element from a smaller index to a larger index', () => {
        // Drop the element at index 0 into gap 2
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          index: 2,
          data: {
            [DesignElementsDataKey]: [
              studio.getDesignElement(element_text_1.id),
            ],
          },
        };

        handleDropOnGap(studio, drop, 'root', 2);

        expect(getChildren()).toEqual([
          containerElement.id,
          element_text_1.id,
          element_text_2.id,
        ]);
      });

      it('moves an element to the end when dropped into the trailing gap', () => {
        // Drop the element at index 0 into the gap after the last child
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          index: 3,
          data: {
            [DesignElementsDataKey]: [
              studio.getDesignElement(element_text_1.id),
            ],
          },
        };

        handleDropOnGap(studio, drop, 'root', 3);

        expect(getChildren()).toEqual([
          containerElement.id,
          element_text_2.id,
          element_text_1.id,
        ]);
      });
    });
  });
});
