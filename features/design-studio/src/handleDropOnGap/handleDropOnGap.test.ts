import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TextElementTemplate } from '@minddrop/designs';
import { DropEventData } from '@minddrop/selection';
import { useDesignStudioStore } from '../DesignStudioStore';
import {
  DesignElementTemplatesDataKey,
  DesignElementsDataKey,
} from '../constants';
import {
  cleanup,
  elementIndex_0,
  elementIndex_1,
  elementIndex_1_0,
  elementIndex_2,
  flatCardElement,
  setup,
} from '../test-utils';
import { DesignStudioDropEventData, FlatRootDesignElement } from '../types';
import { handleDropOnGap } from './handleDropOnGap';

function getChildren() {
  return (
    useDesignStudioStore.getState().elements.root as FlatRootDesignElement
  ).children;
}

const children = flatCardElement.children;

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
  beforeEach(setup);

  afterEach(cleanup);

  describe('invalid drop', () => {
    it('does nothing', () => {
      expect(() =>
        handleDropOnGap({} as DropEventData, 'root', 1),
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
        data: { [DesignElementTemplatesDataKey]: [TextElementTemplate] },
      };

      handleDropOnGap(drop, 'root', 1);

      expect(getChildren()).toEqual(childrenWithNewElement);
    });
  });

  describe('dropped element', () => {
    describe('ignored drops', () => {
      it('does nothing if an element is dropped onto the gap preceeding it', () => {
        // Drop element from index 1 to gap 1, which is before the element
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          index: 1,
          data: { [DesignElementsDataKey]: [elementIndex_1] },
        };

        handleDropOnGap(drop, 'root', 1);

        // Should not change the children
        expect(getChildren()).toEqual(children);
      });

      it('does nothing if an element is dropped onto the gap preceeding it', () => {
        // Drop element from index 1 to gap 2, which is after the element
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          index: 1,
          data: { [DesignElementsDataKey]: [elementIndex_1] },
        };

        handleDropOnGap(drop, 'root', 2);

        // Should not change the children
        expect(getChildren()).toEqual(children);
      });
    });

    describe('drops from diffrent parent', () => {
      it('moves an element from a different parent to after the target index', () => {
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          data: { [DesignElementsDataKey]: [elementIndex_1_0] },
        };

        handleDropOnGap(drop, 'root', 1);

        expect(getChildren()).toEqual([
          elementIndex_0.id,
          elementIndex_1_0.id,
          elementIndex_1.id,
          elementIndex_2.id,
        ]);
      });
    });

    describe('drops within same parent', () => {
      it('moves an element from a larger index to a smaller index', () => {
        // Drop element from index 2 to gap 1
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          data: { [DesignElementsDataKey]: [elementIndex_2] },
        };

        handleDropOnGap(drop, 'root', 1);

        expect(getChildren()).toEqual([
          elementIndex_0.id,
          elementIndex_2.id,
          elementIndex_1.id,
        ]);
      });

      it('moves an element from a smaller index to a larger index', () => {
        // Drop element from index 0 to gap 2
        const drop: DropEventData<DesignStudioDropEventData> = {
          ...baseEvent,
          index: 2,
          data: { [DesignElementsDataKey]: [elementIndex_0] },
        };

        handleDropOnGap(drop, 'root', 2);

        expect(getChildren()).toEqual([
          elementIndex_1.id,
          elementIndex_0.id,
          elementIndex_2.id,
        ]);
      });
    });
  });
});
