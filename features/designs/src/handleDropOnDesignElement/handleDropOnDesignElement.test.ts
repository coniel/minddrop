import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DesignElementTemplate,
  ImageElementConfig,
  TextElementConfig,
  resolveDesignMediaDirPath,
} from '@minddrop/designs';
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
import { MockFs, cleanup, setup } from '../test-utils';
import {
  DesignStudioDropEventData,
  FlatChildDesignElement,
  FlatParentDesignElement,
} from '../types';
import { handleDropOnDesignElement } from './handleDropOnDesignElement';

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

// The root's children with a new element inserted at index 1
const childrenWithNewElement = [...children];
childrenWithNewElement.splice(1, 0, expect.any(String));

const baseEvent = {
  data: {
    [DesignElementsDataKey]: [],
    [DesignElementTemplatesDataKey]: [],
  },
  index: 0,
  position: 'after',
  targetId: element_text_1.id,
  targetType: 'design-element',
  event: new Event('drop'),
} as unknown as DropEventData<DesignStudioDropEventData>;

describe('handleDropOnDesignElement', () => {
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
   * Returns the flat elements of the layout's container element.
   */
  function getContainerChildren(): string[] {
    return studio.getDesignElement<FlatParentDesignElement>(containerElement.id)
      .children;
  }

  describe('dropped image file', () => {
    it("writes the image into the design's media directory", async () => {
      // Add an image element to drop the file onto
      studio.addDesignElementFromTemplate(
        ImageElementConfig.template as DesignElementTemplate,
        'root',
        0,
      );

      const imageElementId = getChildren()[0];

      const drop = {
        ...baseEvent,
        targetId: imageElementId,
        event: {
          dataTransfer: {
            files: [new File(['data'], 'photo.png', { type: 'image/png' })],
          },
        },
      } as unknown as DropEventData<DesignStudioDropEventData>;

      // The inserted element auto-bound to the design's image
      // property, so the image becomes that property's placeholder
      const { property } = studio.getDesignElement(imageElementId);

      expect(property).toBe('Cover');

      handleDropOnDesignElement(studio, drop);

      // Wait for the file write and property update to settle
      await vi.waitFor(() => {
        expect(studio.getDesignProperty('Cover')?.placeholder).toBeTruthy();
      });

      // The image landed in the design's media directory under the
      // generated file name set as the property's placeholder
      const placeholder = studio.getDesignProperty('Cover')?.placeholder;
      const mediaDirPath = resolveDesignMediaDirPath(testDesign.id);

      expect(MockFs.exists(`${mediaDirPath}/${placeholder}`)).toBe(true);
    });

    it("sets the image as an unbound element's own content", async () => {
      // Bind the design's only image property elsewhere, so the new
      // image element has nothing left to bind to
      studio.addDesignElementFromTemplate(
        ImageElementConfig.template as DesignElementTemplate,
        'root',
        0,
      );
      studio.addDesignElementFromTemplate(
        ImageElementConfig.template as DesignElementTemplate,
        'root',
        0,
      );

      const imageElementId = getChildren()[0];

      // The second image element found no free image property
      expect(studio.getDesignElement(imageElementId).property).toBeUndefined();

      const drop = {
        ...baseEvent,
        targetId: imageElementId,
        event: {
          dataTransfer: {
            files: [new File(['data'], 'photo.png', { type: 'image/png' })],
          },
        },
      } as unknown as DropEventData<DesignStudioDropEventData>;

      handleDropOnDesignElement(studio, drop);

      // Wait for the file write and element update to settle
      await vi.waitFor(() => {
        expect(studio.getDesignElement(imageElementId)).toHaveProperty(
          'content',
        );
      });

      // The image landed in the design's media directory under the
      // generated file name set on the element
      const { content } = studio.getDesignElement(imageElementId) as {
        content: string;
      };
      const mediaDirPath = resolveDesignMediaDirPath(testDesign.id);

      expect(MockFs.exists(`${mediaDirPath}/${content}`)).toBe(true);
    });

    it('ignores dropped files which are not images', async () => {
      // Add an image element to drop the file onto
      studio.addDesignElementFromTemplate(
        ImageElementConfig.template as DesignElementTemplate,
        'root',
        0,
      );

      const imageElementId = getChildren()[0];

      const drop = {
        ...baseEvent,
        targetId: imageElementId,
        event: {
          dataTransfer: {
            files: [new File(['data'], 'notes.txt', { type: 'text/plain' })],
          },
        },
      } as unknown as DropEventData<DesignStudioDropEventData>;

      handleDropOnDesignElement(studio, drop);

      // Give the async file handling a chance to run
      await vi.waitFor(() => {
        expect(studio.getDesignElement(imageElementId)).toBeDefined();
      });

      // The element has no image content
      expect(studio.getDesignElement(imageElementId)).not.toHaveProperty(
        'content',
      );
    });
  });

  describe('invalid drop', () => {
    it('does nothing', () => {
      expect(() =>
        handleDropOnDesignElement(studio, {} as DropEventData),
      ).not.toThrow();

      expect(getChildren()).toEqual(children);
    });
  });

  describe('dropped template', () => {
    it('inserts an element from a template after the target element', () => {
      const drop: DropEventData<DesignStudioDropEventData> = {
        ...baseEvent,
        position: 'after',
        data: {
          [DesignElementTemplatesDataKey]: [
            TextElementConfig.template as DesignElementTemplate,
          ],
        },
      };

      handleDropOnDesignElement(studio, drop);

      expect(getChildren()).toEqual(childrenWithNewElement);
    });

    it('inserts an element from a template before the target element', () => {
      const drop: DropEventData<DesignStudioDropEventData> = {
        ...baseEvent,
        position: 'before',
        index: 1,
        targetId: containerElement.id,
        data: {
          [DesignElementTemplatesDataKey]: [
            TextElementConfig.template as DesignElementTemplate,
          ],
        },
      };

      handleDropOnDesignElement(studio, drop);

      expect(getChildren()).toEqual(childrenWithNewElement);
    });

    it('inserts an element from a template inside an empty container', () => {
      // Empty the container so the drop targets it directly
      studio.removeElement(element_text_3.id);

      const drop: DropEventData<DesignStudioDropEventData> = {
        ...baseEvent,
        position: 'inside',
        targetId: containerElement.id,
        data: {
          [DesignElementTemplatesDataKey]: [
            TextElementConfig.template as DesignElementTemplate,
          ],
        },
      };

      handleDropOnDesignElement(studio, drop);

      // The new element is the container's only child
      expect(getContainerChildren()).toEqual([expect.any(String)]);
      // The root's children are unchanged
      expect(getChildren()).toEqual(children);
    });
  });

  describe('dropped element', () => {
    describe('ignored drops', () => {
      it('does nothing if an element is dropped onto itself', () => {
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          targetId: element_text_2.id,
          data: {
            [DesignElementsDataKey]: [
              studio.getDesignElement(element_text_2.id),
            ],
          },
        };

        handleDropOnDesignElement(studio, drop);

        // Should not change the children
        expect(getChildren()).toEqual(children);
      });

      it('does nothing if an element is dropped into its own children', () => {
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          targetId: element_text_3.id,
          data: {
            [DesignElementsDataKey]: [
              studio.getDesignElement(containerElement.id),
            ],
          },
        };

        handleDropOnDesignElement(studio, drop);

        // Should not change the children
        expect(getChildren()).toEqual(children);
      });

      it('does nothing if an element is dropped inside itself', () => {
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          position: 'inside',
          targetId: containerElement.id,
          data: {
            [DesignElementsDataKey]: [
              studio.getDesignElement(containerElement.id),
            ],
          },
        };

        handleDropOnDesignElement(studio, drop);

        // Should not change the children
        expect(getChildren()).toEqual(children);
        expect(getContainerChildren()).toEqual([element_text_3.id]);
      });

      it('does nothing if a previous sibling element is dropped into the same position', () => {
        // Drop element from index 0 to before index 1
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          targetId: containerElement.id,
          index: 1,
          position: 'before',
          data: {
            [DesignElementsDataKey]: [
              studio.getDesignElement(element_text_1.id),
            ],
          },
        };

        handleDropOnDesignElement(studio, drop);

        // Should not change the children
        expect(getChildren()).toEqual(children);
      });

      it('does nothing if a next sibling element is dropped into the same position', () => {
        // Drop element from index 2 to after index 1
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          targetId: containerElement.id,
          index: 1,
          position: 'after',
          data: {
            [DesignElementsDataKey]: [
              studio.getDesignElement(element_text_2.id),
            ],
          },
        };

        handleDropOnDesignElement(studio, drop);

        // Should not change the children
        expect(getChildren()).toEqual(children);
      });
    });

    describe('drops from a different parent', () => {
      it('moves an element from a different parent to after the target element', () => {
        // Drop the container's child to after root index 0
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          targetId: element_text_1.id,
          index: 0,
          position: 'after',
          data: {
            [DesignElementsDataKey]: [
              studio.getDesignElement(element_text_3.id),
            ],
          },
        };

        handleDropOnDesignElement(studio, drop);

        expect(getChildren()).toEqual([
          element_text_1.id,
          element_text_3.id,
          containerElement.id,
          element_text_2.id,
        ]);
        // The element left its original parent
        expect(getContainerChildren()).toEqual([]);
      });

      it('moves an element from a different parent to before the target element', () => {
        // Drop the container's child to before root index 0
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          targetId: element_text_1.id,
          index: 0,
          position: 'before',
          data: {
            [DesignElementsDataKey]: [
              studio.getDesignElement(element_text_3.id),
            ],
          },
        };

        handleDropOnDesignElement(studio, drop);

        expect(getChildren()).toEqual([
          element_text_3.id,
          element_text_1.id,
          containerElement.id,
          element_text_2.id,
        ]);
      });

      it('moves an element into an empty container', () => {
        // Empty the container so the drop targets it directly
        studio.removeElement(element_text_3.id);

        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          position: 'inside',
          targetId: containerElement.id,
          data: {
            [DesignElementsDataKey]: [
              studio.getDesignElement(element_text_2.id),
            ],
          },
        };

        handleDropOnDesignElement(studio, drop);

        // The dropped element became the container's child
        expect(getContainerChildren()).toEqual([element_text_2.id]);
        // And left the root
        expect(getChildren()).toEqual([element_text_1.id, containerElement.id]);
      });
    });

    describe('stale drag payloads', () => {
      it('sorts an element whose payload predates its last move', () => {
        // The element as it was before being moved out of the
        // container, which is what a second drag of an element
        // still carries
        const staleElement = studio.getDesignElement<FlatChildDesignElement>(
          element_text_3.id,
        );

        // Move it up to the front of the root, leaving the payload
        // pointing at the container it used to live in
        studio.moveDesignElement(element_text_3.id, 'root', 0);

        // Drop it before the root's last child
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          targetId: element_text_2.id,
          index: 3,
          position: 'before',
          data: { [DesignElementsDataKey]: [staleElement] },
        };

        handleDropOnDesignElement(studio, drop);

        // Resolving the element's real parent takes the sort path,
        // which accounts for the element leaving its own index.
        // Trusting the payload would treat this as a move from the
        // container and land the element after the target.
        expect(getChildren()).toEqual([
          element_text_1.id,
          containerElement.id,
          element_text_3.id,
          element_text_2.id,
        ]);
      });

      it('ignores a payload for an element which no longer exists', () => {
        const staleElement = studio.getDesignElement<FlatChildDesignElement>(
          element_text_3.id,
        );

        studio.removeElement(element_text_3.id);

        const childrenBefore = getChildren();

        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          targetId: element_text_1.id,
          index: 0,
          position: 'after',
          data: { [DesignElementsDataKey]: [staleElement] },
        };

        handleDropOnDesignElement(studio, drop);

        expect(getChildren()).toEqual(childrenBefore);
      });
    });

    describe('drops within the same parent', () => {
      it('correctly sorts an element from a larger index when dropped before the target element', () => {
        // Drop element from index 2 to before index 1
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          targetId: containerElement.id,
          index: 1,
          position: 'before',
          data: {
            [DesignElementsDataKey]: [
              studio.getDesignElement(element_text_2.id),
            ],
          },
        };

        handleDropOnDesignElement(studio, drop);

        expect(getChildren()).toEqual([
          element_text_1.id,
          element_text_2.id,
          containerElement.id,
        ]);
      });

      it('correctly sorts an element from a smaller index when dropped before the target element', () => {
        // Drop element from index 0 to before index 2
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          targetId: element_text_2.id,
          index: 2,
          position: 'before',
          data: {
            [DesignElementsDataKey]: [
              studio.getDesignElement(element_text_1.id),
            ],
          },
        };

        handleDropOnDesignElement(studio, drop);

        expect(getChildren()).toEqual([
          containerElement.id,
          element_text_1.id,
          element_text_2.id,
        ]);
      });

      it('correctly sorts an element from a larger index when dropped after the target element', () => {
        // Drop element from index 2 to after index 0
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          targetId: element_text_1.id,
          index: 0,
          position: 'after',
          data: {
            [DesignElementsDataKey]: [
              studio.getDesignElement(element_text_2.id),
            ],
          },
        };

        handleDropOnDesignElement(studio, drop);

        expect(getChildren()).toEqual([
          element_text_1.id,
          element_text_2.id,
          containerElement.id,
        ]);
      });

      it('correctly sorts an element from a smaller index when dropped after the target element', () => {
        // Drop element from index 0 to after index 1
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          targetId: containerElement.id,
          index: 1,
          position: 'after',
          data: {
            [DesignElementsDataKey]: [
              studio.getDesignElement(element_text_1.id),
            ],
          },
        };

        handleDropOnDesignElement(studio, drop);

        expect(getChildren()).toEqual([
          containerElement.id,
          element_text_1.id,
          element_text_2.id,
        ]);
      });
    });
  });
});
