import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DesignElementTemplate,
  ElementTemplates,
  TextElementConfig,
  resolveDesignMediaDirPath,
} from '@minddrop/designs-legacy';
import { DropEventData } from '@minddrop/selection';
import {
  addDesignElementFromTemplate,
  getDesignElement,
} from '../DesignStudioStore';
import {
  DesignElementTemplatesDataKey,
  DesignElementsDataKey,
} from '../constants';
import {
  MockFs,
  cleanup,
  element_0,
  element_1,
  element_1_0,
  element_2,
  flat_root_1,
  setup,
  testDesign,
  testLayout,
} from '../test-utils';
import { DesignStudioDropEventData, FlatRootDesignElement } from '../types';
import { handleDropOnDesignElement } from './handleDropOnDesignElement';

function getChildren() {
  return getDesignElement<FlatRootDesignElement>('root').children;
}

const children = flat_root_1.children;
// Children with a new element inserted at index 1
const childrenWithNewElement = [...children];
childrenWithNewElement.splice(1, 0, expect.any(String));

const baseEvent = {
  data: {
    [DesignElementsDataKey]: [],
    [DesignElementTemplatesDataKey]: [],
  },
  index: 0,
  position: 'after',
  targetId: testLayout.tree.children[0].id,
  targetType: 'design-element',
  event: new Event('drop'),
} as unknown as DropEventData<DesignStudioDropEventData>;

describe('handleDropOnDesignElement', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('dropped image file', () => {
    it("writes the image into the design's media directory", async () => {
      // Add an image element to drop the file onto
      addDesignElementFromTemplate(ElementTemplates.image, 'root', 0);

      const imageElementId =
        getDesignElement<FlatRootDesignElement>('root').children[0];

      const drop = {
        ...baseEvent,
        targetId: imageElementId,
        event: {
          dataTransfer: {
            files: [new File(['data'], 'photo.png', { type: 'image/png' })],
          },
        },
      } as unknown as DropEventData<DesignStudioDropEventData>;

      handleDropOnDesignElement(drop);

      // Wait for the file write and element update to settle
      await vi.waitFor(() => {
        expect(getDesignElement(imageElementId)).toHaveProperty('content');
      });

      // The image landed in the design's media directory under the
      // generated file name set on the element
      const { content } = getDesignElement(imageElementId) as {
        content: string;
      };
      const mediaDirPath = resolveDesignMediaDirPath(testDesign.id);

      expect(MockFs.exists(`${mediaDirPath}/${content}`)).toBe(true);
    });
  });

  describe('invalid drop', () => {
    it('does nothing', () => {
      expect(() =>
        handleDropOnDesignElement({} as DropEventData),
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

      handleDropOnDesignElement(drop);

      expect(getChildren()).toEqual(childrenWithNewElement);
    });

    it('inserts an element from a template before the target element', () => {
      const drop: DropEventData<DesignStudioDropEventData> = {
        ...baseEvent,
        position: 'before',
        index: 1,
        targetId: testLayout.tree.children[1].id,
        data: {
          [DesignElementTemplatesDataKey]: [
            TextElementConfig.template as DesignElementTemplate,
          ],
        },
      };

      handleDropOnDesignElement(drop);

      expect(getChildren()).toEqual(childrenWithNewElement);
    });
  });

  describe('dropped element', () => {
    describe('ignored drops', () => {
      it('does nothing if an element is dropped onto itself', () => {
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          targetId: element_2.id,
          data: { [DesignElementsDataKey]: [element_2] },
        };

        handleDropOnDesignElement(drop);

        // Should not change the children
        expect(getChildren()).toEqual(children);
      });

      it('does nothing if an element is dropped into its own children', () => {
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          targetId: element_1_0.id,
          data: { [DesignElementsDataKey]: [element_1] },
        };

        handleDropOnDesignElement(drop);

        // Should not change the children
        expect(getChildren()).toEqual(children);
      });

      it('does nothing if a previous sibling element is dropped into the same position', () => {
        // Drop element from index 0 to before index 1
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          targetId: element_1.id,
          index: 1,
          position: 'before',
          data: { [DesignElementsDataKey]: [element_0] },
        };

        handleDropOnDesignElement(drop);

        // Should not change the children
        expect(getChildren()).toEqual(children);
      });

      it('does nothing if a next sibling element is dropped into the same position', () => {
        // Drop element from index 2 to after index 1
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          targetId: element_1.id,
          index: 1,
          position: 'after',
          data: { [DesignElementsDataKey]: [element_2] },
        };

        handleDropOnDesignElement(drop);

        // Should not change the children
        expect(getChildren()).toEqual(children);
      });
    });

    describe('drops from diffrent parent', () => {
      it('moves an element from a different parent to after the target element', () => {
        // Drop element from index 1_0 to after index 0
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          targetId: element_0.id,
          index: 0,
          position: 'after',
          data: { [DesignElementsDataKey]: [element_1_0] },
        };

        handleDropOnDesignElement(drop);

        expect(getChildren()).toEqual([
          element_0.id,
          element_1_0.id,
          element_1.id,
          element_2.id,
        ]);
      });

      it('moves an element from a different parent to before the target element', () => {
        // Drop element from index 1_0 to before index 0
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          targetId: element_0.id,
          index: 0,
          position: 'before',
          data: { [DesignElementsDataKey]: [element_1_0] },
        };

        handleDropOnDesignElement(drop);

        expect(getChildren()).toEqual([
          element_1_0.id,
          element_0.id,
          element_1.id,
          element_2.id,
        ]);
      });
    });

    describe('drops within same parent', () => {
      it('correctly sorts and element from a larger index when dropped before the target element', () => {
        // Drop element from index 2 to before index 1
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          targetId: element_1.id,
          index: 1,
          position: 'before',
          data: { [DesignElementsDataKey]: [element_2] },
        };

        handleDropOnDesignElement(drop);

        expect(getChildren()).toEqual([
          element_0.id,
          element_2.id,
          element_1.id,
        ]);
      });

      it('correctly sorts and element from a smaller index when dropped before the target element', () => {
        // Drop element from index 0 to before index 2
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          targetId: element_2.id,
          index: 2,
          position: 'before',
          data: { [DesignElementsDataKey]: [element_0] },
        };

        handleDropOnDesignElement(drop);

        expect(getChildren()).toEqual([
          element_1.id,
          element_0.id,
          element_2.id,
        ]);
      });

      it('correctly sorts and element from a larger index when dropped after the target element', () => {
        // Drop element from index 2 to after index 0
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          targetId: element_0.id,
          index: 0,
          position: 'after',
          data: { [DesignElementsDataKey]: [element_2] },
        };

        handleDropOnDesignElement(drop);

        expect(getChildren()).toEqual([
          element_0.id,
          element_2.id,
          element_1.id,
        ]);
      });

      it('correctly sorts and element from a smaller index when dropped after the target element', () => {
        // Drop element from index 0 to after index 1
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          targetId: element_1.id,
          index: 1,
          position: 'after',
          data: { [DesignElementsDataKey]: [element_0] },
        };

        handleDropOnDesignElement(drop);

        expect(getChildren()).toEqual([
          element_1.id,
          element_0.id,
          element_2.id,
        ]);
      });
    });
  });
});
