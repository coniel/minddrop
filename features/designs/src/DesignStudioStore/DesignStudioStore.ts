import {
  Design,
  DesignElement,
  DesignElementStyle,
  DesignElementTemplate,
  Designs,
  elementConfigs,
} from '@minddrop/designs';
import {
  PropertiesSchema,
  PropertyMap,
  PropertySchema,
} from '@minddrop/properties';
import { createStore, useShallow } from '@minddrop/stores';
import { deepMerge, reorderArray, uuid } from '@minddrop/utils';
import {
  FlatChildDesignElement,
  FlatDesignElement,
  FlatParentDesignElement,
} from '../types';
import { flattenTree, reconstructTree } from '../utils';

// Makes a type deeply partial one level down: object-valued
// properties (style, format) become Partial so callers can
// pass e.g. { format: { decimals: 3 } } without all fields
type DeepPartialOne<T> = {
  [K in keyof T]?: NonNullable<T[K]> extends object
    ? Partial<NonNullable<T[K]>>
    : T[K];
};

// Distributes Partial over a union so that properties from any
// member of the union are accepted, not just common ones
type DesignElementUpdates<T> = T extends unknown
  ? DeepPartialOne<Omit<T, 'id' | 'type'>>
  : never;

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
   * The ID of the currently selected element, or null if none.
   */
  selectedElementId: string | null;

  /**
   * The ID of the element highlighted on the canvas, or null if none.
   */
  highlightedElementId: string | null;

  /**
   * The ID of the element whose highlight is fading out, or null if none.
   */
  fadingHighlightElementId: string | null;

  /**
   * The properties of the design's parent (e.g. database), if any.
   */
  properties: PropertiesSchema;

  /**
   * The values of the properties.
   */
  propertyValues: PropertyMap;

  /**
   * The current zoom level (1 = 100%).
   */
  zoom: number;

  /**
   * The current pan offset in pixels.
   */
  pan: { x: number; y: number };

  /**
   * Sets the zoom level, optionally zooming toward a focal point.
   * @param zoom - The new zoom level (clamped to 0.1–3).
   * @param focalPoint - The point in viewport coordinates to zoom toward.
   */
  setZoom: (zoom: number, focalPoint?: { x: number; y: number }) => void;

  /**
   * Sets the pan offset.
   * @param x - The horizontal offset.
   * @param y - The vertical offset.
   */
  setPan: (x: number, y: number) => void;

  /**
   * Resets zoom to 1 and pan to { x: 0, y: 0 }.
   */
  resetView: () => void;

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
    updates: DesignElementUpdates<DesignElement>,
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
   * Selects an element by ID, or deselects if null.
   * Also highlights the element on the canvas.
   * @param id - The ID of the element to select, or null to deselect.
   */
  selectElement: (id: string | null) => void;

  /**
   * Clears the canvas highlight with a fade-out animation.
   */
  clearHighlight: () => void;

  /**
   * Clears the fading highlight after the animation completes.
   */
  clearFadingHighlight: () => void;

  /**
   * Resets the store to its initial state.
   */
  clear: () => void;
}

export const DesignStudioStore = createStore<DesignStudioStore>((set) => ({
  initialized: false,
  design: null,
  elements: {},
  selectedElementId: null,
  highlightedElementId: null,
  fadingHighlightElementId: null,
  properties: [],
  propertyValues: {},
  zoom: 1,
  pan: { x: 0, y: 0 },

  setZoom: (zoom, focalPoint) => {
    // Clamp zoom to 0.1–3
    const clampedZoom = Math.min(3, Math.max(0.1, zoom));

    set((state) => {
      if (focalPoint) {
        // Adjust pan so the point under the cursor stays stationary
        const newPanX =
          focalPoint.x -
          (focalPoint.x - state.pan.x) * (clampedZoom / state.zoom);
        const newPanY =
          focalPoint.y -
          (focalPoint.y - state.pan.y) * (clampedZoom / state.zoom);

        return { zoom: clampedZoom, pan: { x: newPanX, y: newPanY } };
      }

      return { zoom: clampedZoom };
    });
  },

  setPan: (x, y) => set({ pan: { x, y } }),

  resetView: () => set({ zoom: 1, pan: { x: 0, y: 0 } }),

  initialize: (design, properties = [], propertyValues = {}) => {
    set({
      design,
      elements: flattenTree(design.tree),
      selectedElementId: 'root',
      highlightedElementId: null,
      fadingHighlightElementId: null,
      properties,
      propertyValues,
      initialized: true,
      zoom: 1,
      pan: { x: 0, y: 0 },
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
        Object.assign(
          element,
          deepMerge(element, updates as Partial<FlatDesignElement>),
        );
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

  selectElement: (id) =>
    set({
      selectedElementId: id ?? 'root',
      highlightedElementId: id,
      fadingHighlightElementId: null,
    }),

  clearHighlight: () =>
    set((state) => ({
      highlightedElementId: null,
      fadingHighlightElementId: state.highlightedElementId,
    })),

  clearFadingHighlight: () => set({ fadingHighlightElementId: null }),

  clear: () =>
    set({
      elements: {},
      selectedElementId: null,
      highlightedElementId: null,
      fadingHighlightElementId: null,
      properties: [],
      initialized: false,
    }),
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

export const updateDesignElement = <T extends DesignElement>(
  id: string,
  updates: DesignElementUpdates<T>,
) => {
  const store = DesignStudioStore.getState();

  store.updateElement(id, updates);
  store.clearHighlight();
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
  // Look up the config for this element type to generate a placeholder
  const config = elementConfigs.find((config) => config.type === template.type);
  const placeholder = config?.generatePlaceholder?.();

  const element = {
    ...template,
    id: uuid(),
    parent: parentId,
    ...(placeholder != null ? { placeholder } : {}),
  } as FlatDesignElement;

  DesignStudioStore.getState().addElement(element, parentId, index);
  saveDesign();
};

export const updateElementStyle = <K extends keyof DesignElementStyle>(
  id: string,
  key: K,
  value: DesignElementStyle[K],
) => {
  const store = DesignStudioStore.getState();

  store.updateElement(id, { style: { [key]: value } });
  store.clearHighlight();
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

/**
 * Subscribes to element-specific data with a single selector.
 * Consolidates multiple store reads into one call and avoids
 * per-call type casts at the call site. Annotate the callback
 * parameter with the concrete element type so both generics
 * are inferred automatically.
 */
export const useElementData = <
  TElement,
  TResult extends Record<string, unknown>,
>(
  id: string,
  selector: (element: TElement) => TResult,
): TResult => {
  return useDesignStudioStore(
    useShallow((state) => selector(state.elements[id] as TElement)),
  );
};

export const useElementStyle = <K extends keyof DesignElementStyle>(
  id: string,
  key: K,
): DesignElementStyle[K] => {
  const element = useElement(id);

  return (element.style as DesignElementStyle)[key];
};

export const useProperty = (name: string): PropertySchema | null => {
  const property = useDesignStudioStore(
    useShallow((state) =>
      state.properties.find((property) => property.name === name),
    ),
  );

  return property || null;
};
