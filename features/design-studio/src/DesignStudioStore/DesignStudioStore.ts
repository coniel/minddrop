import {
  Design,
  DesignElement,
  DesignElementStyle,
  DesignElementTemplate,
  Designs,
} from '@minddrop/designs';
import {
  PropertiesSchema,
  PropertyMap,
  PropertySchema,
} from '@minddrop/properties';
import {
  createStore,
  deepMerge,
  reorderArray,
  useShallow,
  uuid,
} from '@minddrop/utils';
import {
  FlatChildDesignElement,
  FlatDesignElement,
  FlatParentDesignElement,
} from '../types';
import { flattenTree, getElementStyleValue, reconstructTree } from '../utils';

export interface DesignStudioStore {
  /**
   * Whether the store has been initialized.
   */
  initialized: boolean;

  /**
   * The design being edited.
   */
  design: Design | null;

  /**
   * An [id]: FlatDesignElement map of the elements which are part of the current design.
   */
  elements: Record<string, FlatDesignElement>;

  /**
   * The properties of the design's parent (e.g. database), if any.
   */
  properties: PropertiesSchema;

  /**
   * The values of the properties.
   */
  propertyValues: PropertyMap;

  /**
   * Sets the initial elements state and initializes the store.
   * @param elements - The design element tree.
   * @param properties - The parent's properties.
   * @param propertyValues - The parent's property values.
   */
  initialize: (
    design: Design,
    properties?: PropertiesSchema,
    propertyValues?: PropertyMap,
  ) => void;

  /**
   * Adds an element to the store.
   * @param element - The element to add.
   * @param parentId - The ID of the parent element.
   * @param index - The index to add the element at.
   */
  addElement: (
    element: FlatDesignElement,
    parentId: string,
    index: number,
  ) => void;

  /**
   * Updates the properties of an element.
   * @param id - The ID of the element to update.
   * @param updates - The updates to apply to the element.
   */
  updateElement: (
    id: string,
    updates: Partial<Omit<DesignElement, 'children'>>,
  ) => void;

  /**
   * Moves an element to a new parent.
   * @param id - The ID of the element to move.
   * @param newParentId - The ID of the new parent element.
   * @param index - The index to move the element to.
   */
  moveElement: (id: string, newParentId: string, index: number) => void;

  /**
   * Sorts an element to a new index within its parent.
   * @param elementId - The ID of the element to sort.
   * @param targetIndex - The index to sort the element to.
   */
  sortElement: (elementId: string, targetIndex: number) => void;

  /**
   * Removes an element from the store.
   * @param id - The ID of the element to remove.
   */
  removeElement: (id: string) => void;

  /**
   * Resets the store to its initial state.
   */
  clear: () => void;
}

export const DesignStudioStore = createStore<DesignStudioStore>((set) => ({
  initialized: false,
  design: null,
  elements: {},
  properties: [],
  propertyValues: {},

  initialize: (design, properties = [], propertyValues = {}) => {
    set({
      design,
      elements: flattenTree(design.tree),
      properties,
      propertyValues,
      initialized: true,
    });
  },

  addElement: (element, parentId, index) => {
    set((state) => {
      const parent = { ...state.elements[parentId] };

      if (!('children' in parent)) {
        throw new Error(
          `Parent element with ID ${parentId} is not a container.`,
        );
      }

      parent.children.splice(index, 0, element.id);

      return {
        elements: {
          ...state.elements,
          [parentId]: parent,
          [element.id]: element,
        },
      };
    });
  },

  updateElement: (id, updates) => {
    set((state) => {
      const element = { ...state.elements[id] };

      if (element) {
        Object.assign(element, deepMerge(element, updates));
      }

      return { elements: { ...state.elements, [id]: element } };
    });
  },

  moveElement: (id, newParentId, index) => {
    set((state) => {
      const element = { ...state.elements[id] };

      if (!('parent' in element)) {
        throw new Error(`Cannot move root element.`);
      }

      const oldParent = { ...state.elements[element.parent] };
      const newParent = { ...state.elements[newParentId] };

      if (!('children' in oldParent)) {
        throw new Error(
          `Old parent element with ID ${element.parent} is not a container.`,
        );
      }

      if (!('children' in newParent)) {
        throw new Error(
          `New parent element with ID ${newParentId} is not a container.`,
        );
      }

      oldParent.children.splice(oldParent.children.indexOf(id), 1);
      newParent.children.splice(index, 0, id);

      return {
        elements: {
          ...state.elements,
          [element.parent]: oldParent,
          [newParentId]: newParent,
          [id]: element,
        },
      };
    });
  },

  sortElement: (elementId, targetIndex) => {
    set((state) => {
      const element = state.elements[elementId] as FlatChildDesignElement;
      const parentElement = state.elements[
        element.parent
      ] as FlatParentDesignElement;

      const reorderedChildren = reorderArray(
        parentElement.children,
        parentElement.children.indexOf(elementId),
        targetIndex,
      );

      return {
        elements: {
          ...state.elements,
          [parentElement.id]: {
            ...parentElement,
            children: reorderedChildren,
          },
        },
      };
    });
  },

  removeElement: (id) => {
    set((state) => {
      const { [id]: element, ...rest } = state.elements;

      if (!('parent' in element)) {
        throw new Error(`Cannot remove root element.`);
      }

      const parent = { ...state.elements[element.parent] };

      if ('children' in parent) {
        const index = parent.children.indexOf(id);
        parent.children.splice(index, 1);
      }

      return { elements: { ...rest, [element.parent]: parent } };
    });
  },

  clear: () => set({ elements: {}, properties: [], initialized: false }),
}));

export const useDesignStudioStore = DesignStudioStore;

export const saveDesign = () => {
  const design = DesignStudioStore.getState().design;
  const tree = reconstructTree(DesignStudioStore.getState().elements);

  if (!design) {
    return;
  }

  Designs.update(design.id, { tree });
};

export const getDesignElement = <
  TType extends
    | FlatDesignElement
    | FlatChildDesignElement
    | FlatParentDesignElement = FlatDesignElement,
>(
  id: string,
): TType => DesignStudioStore.getState().elements[id] as TType;

export const updateDesignElement = (
  id: string,
  updates: Partial<FlatDesignElement>,
) => {
  DesignStudioStore.getState().updateElement(id, updates);
  saveDesign();
};

export const moveDesignElement = (
  id: string,
  newParentId: string,
  index: number,
) => {
  DesignStudioStore.getState().moveElement(id, newParentId, index);
  saveDesign();
};

export const sortDesignElement = (elementId: string, targetIndex: number) => {
  DesignStudioStore.getState().sortElement(elementId, targetIndex);
  saveDesign();
};

export const addDeisgnElementFromTemplate = (
  template: DesignElementTemplate,
  parentId: string,
  index: number,
) => {
  const element = {
    ...template,
    id: uuid(),
    parent: parentId,
  } as FlatDesignElement;

  DesignStudioStore.getState().addElement(element, parentId, index);
  saveDesign();
};

export const updateElementStyle = <K extends keyof DesignElementStyle>(
  id: string,
  key: K,
  value: DesignElementStyle[K],
) => {
  useDesignStudioStore
    .getState()
    .updateElement(id, { style: { [key]: value } });

  saveDesign();
};

export const useElement = <
  TType extends
    | FlatDesignElement
    | FlatChildDesignElement
    | FlatParentDesignElement = FlatDesignElement,
>(
  id: string,
): TType => {
  const element = useDesignStudioStore((state) => state.elements[id]);

  return element as TType;
};

export const useElementStyle = <K extends keyof DesignElementStyle>(
  id: string,
  key: K,
): DesignElementStyle[K] => {
  const element = useElement(id);

  return getElementStyleValue(element, key);
};

export const useProperty = (name: string): PropertySchema | null => {
  const property = useDesignStudioStore(
    useShallow((state) =>
      state.properties.find((property) => property.name === name),
    ),
  );

  return property || null;
};
