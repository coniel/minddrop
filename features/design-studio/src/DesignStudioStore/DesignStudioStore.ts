import {
  DesignElement,
  DesignElementStyle,
  RootDesignElement,
} from '@minddrop/designs';
import { PropertiesSchema, PropertySchema } from '@minddrop/properties';
import { createStore, deepMerge, useShallow } from '@minddrop/utils';
import { FlatDesignElement } from '../types';
import { flattenTree, getElementStyleValue } from '../utils';

export interface DesignStudioStore {
  /**
   * Whether the store has been initialized.
   */
  initialized: boolean;

  /**
   * An [id]: FlatDesignElement map of the elements which are part of the current design.
   */
  elements: Record<string, FlatDesignElement>;

  /**
   * The properties of the design's parent (e.g. database), if any.
   */
  properties: PropertiesSchema;

  /**
   * Sets the initial elements state and initializes the store.
   * @param elements - The design element tree.
   * @param properties - The parent's properties.
   */
  initialize: (tree: RootDesignElement, properties?: PropertiesSchema) => void;

  /**
   * Updates the properties of an element.
   * @param id - The ID of the element to update.
   * @param updates - The updates to apply to the element.
   */
  updateElement: (id: string, updates: Partial<DesignElement>) => void;

  /**
   * Resets the store to its initial state.
   */
  clear: () => void;
}

export const DesignStudioStore = createStore<DesignStudioStore>((set) => ({
  initialized: false,
  elements: {},
  properties: [],

  initialize: (tree: RootDesignElement, properties: PropertiesSchema = []) => {
    set({
      elements: flattenTree(tree),
      properties: properties,
      initialized: true,
    });
  },

  updateElement: (
    id: string,
    updates: Partial<Omit<DesignElement, 'children'>>,
  ) => {
    set((state) => {
      const element = { ...state.elements[id] };

      if (element) {
        Object.assign(element, deepMerge(element, updates));
      }

      return { elements: { ...state.elements, [id]: element } };
    });
  },

  clear: () => set({ elements: {}, properties: [], initialized: false }),
}));

export const useDesignStudioStore = DesignStudioStore;

export const useElement = (id: string): FlatDesignElement => {
  const element = useDesignStudioStore(
    useShallow((state) => state.elements[id]),
  );

  return element;
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

export const updateElementStyle = <K extends keyof DesignElementStyle>(
  id: string,
  key: K,
  value: DesignElementStyle[K],
) => {
  useDesignStudioStore
    .getState()
    .updateElement(id, { style: { [key]: value } });
};
