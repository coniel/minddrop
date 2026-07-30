import {
  Design,
  DesignElement,
  DesignElementStyle,
  DesignElementTemplate,
  Designs,
  Layout,
  LayoutFrame,
  LayoutType,
  Layouts,
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
   * The ID of the layout currently being edited, or null if none.
   */
  activeLayoutId: string | null;

  /**
   * A [layoutId]: { [elementId]: FlatDesignElement } map of the
   * elements of each of the design's layouts.
   */
  elementsByLayout: Record<string, Record<string, FlatDesignElement>>;

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
   * Initializes the store with a design, flattening each of its
   * layouts' element trees. No layout is active until one is
   * selected via setActiveLayout.
   * @param design - The design to edit.
   * @param properties - The parent's properties.
   * @param propertyValues - The parent's property values.
   */
  initialize: (
    design: Design,
    properties?: PropertiesSchema,
    propertyValues?: PropertyMap,
  ) => void;

  /**
   * Replaces the design snapshot without re-flattening elements.
   * @param design - The updated design.
   */
  setDesign: (design: Design) => void;

  /**
   * Sets the active layout, or clears it when null. Selects the
   * layout's root element and clears any highlight.
   * @param layoutId - The ID of the layout to activate, or null.
   */
  setActiveLayout: (layoutId: string | null) => void;

  /**
   * Adds an element to the layout containing the parent element.
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
   * Replaces an element outright, e.g. to remove a property
   * that a deep merge cannot unset.
   * @param id - The ID of the element to replace.
   * @param element - The new element.
   */
  replaceElement: (id: string, element: FlatDesignElement) => void;

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
  activeLayoutId: null,
  elementsByLayout: {},
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
    // Flatten each layout's element tree into its own bucket
    const elementsByLayout = Object.fromEntries(
      design.layouts.map((layout) => [layout.id, flattenTree(layout.tree)]),
    );

    set({
      design,
      elementsByLayout,
      activeLayoutId: null,
      selectedElementId: null,
      highlightedElementId: null,
      fadingHighlightElementId: null,
      properties,
      propertyValues,
      initialized: true,
      zoom: 1,
      pan: { x: 0, y: 0 },
    });
  },

  setDesign: (design) => set({ design }),

  setActiveLayout: (layoutId) =>
    set({
      activeLayoutId: layoutId,
      selectedElementId: layoutId ? 'root' : null,
      highlightedElementId: null,
      fadingHighlightElementId: null,
    }),

  addElement: (element, parentId, index) => {
    set((state) => {
      // The new element goes into the layout containing the parent
      const layoutId = findElementLayoutId(state, parentId);

      if (!layoutId) {
        throw new Error(`Parent element with ID ${parentId} does not exist.`);
      }

      const elements = state.elementsByLayout[layoutId];
      const parent = { ...elements[parentId] };

      if (!('children' in parent)) {
        throw new Error(
          `Parent element with ID ${parentId} is not a container.`,
        );
      }

      parent.children = [...parent.children];
      parent.children.splice(index, 0, element.id);

      return {
        elementsByLayout: {
          ...state.elementsByLayout,
          [layoutId]: {
            ...elements,
            [parentId]: parent,
            [element.id]: element,
          },
        },
      };
    });
  },

  updateElement: (id, updates) => {
    set((state) => {
      const layoutId = findElementLayoutId(state, id);

      if (!layoutId) {
        return {};
      }

      const elements = state.elementsByLayout[layoutId];
      const element = { ...elements[id] };

      Object.assign(
        element,
        deepMerge(element, updates as Partial<FlatDesignElement>),
      );

      return {
        elementsByLayout: {
          ...state.elementsByLayout,
          [layoutId]: { ...elements, [id]: element },
        },
      };
    });
  },

  replaceElement: (id, element) => {
    set((state) => {
      const layoutId = findElementLayoutId(state, id);

      if (!layoutId) {
        return {};
      }

      return {
        elementsByLayout: {
          ...state.elementsByLayout,
          [layoutId]: { ...state.elementsByLayout[layoutId], [id]: element },
        },
      };
    });
  },

  moveElement: (id, newParentId, index) => {
    set((state) => {
      const layoutId = findElementLayoutId(state, id);

      if (!layoutId) {
        throw new Error(`Element with ID ${id} does not exist.`);
      }

      const elements = state.elementsByLayout[layoutId];
      const element = { ...elements[id] };

      if (!('parent' in element)) {
        throw new Error(`Cannot move root element.`);
      }

      const oldParent = { ...elements[element.parent] };
      const newParent = { ...elements[newParentId] };

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

      oldParent.children = [...oldParent.children];
      oldParent.children.splice(oldParent.children.indexOf(id), 1);
      newParent.children = [...newParent.children];
      newParent.children.splice(index, 0, id);

      return {
        elementsByLayout: {
          ...state.elementsByLayout,
          [layoutId]: {
            ...elements,
            [element.parent]: oldParent,
            [newParentId]: newParent,
            [id]: element,
          },
        },
      };
    });
  },

  sortElement: (elementId, targetIndex) => {
    set((state) => {
      const layoutId = findElementLayoutId(state, elementId);

      if (!layoutId) {
        throw new Error(`Element with ID ${elementId} does not exist.`);
      }

      const elements = state.elementsByLayout[layoutId];
      const element = elements[elementId] as FlatChildDesignElement;
      const parentElement = elements[element.parent] as FlatParentDesignElement;

      const reorderedChildren = reorderArray(
        parentElement.children,
        parentElement.children.indexOf(elementId),
        targetIndex,
      );

      return {
        elementsByLayout: {
          ...state.elementsByLayout,
          [layoutId]: {
            ...elements,
            [parentElement.id]: {
              ...parentElement,
              children: reorderedChildren,
            },
          },
        },
      };
    });
  },

  removeElement: (id) => {
    set((state) => {
      const layoutId = findElementLayoutId(state, id);

      if (!layoutId) {
        throw new Error(`Element with ID ${id} does not exist.`);
      }

      const { [id]: element, ...rest } = state.elementsByLayout[layoutId];

      if (!('parent' in element)) {
        throw new Error(`Cannot remove root element.`);
      }

      const parent = { ...rest[element.parent] };

      if ('children' in parent) {
        parent.children = parent.children.filter((childId) => childId !== id);
      }

      return {
        elementsByLayout: {
          ...state.elementsByLayout,
          [layoutId]: { ...rest, [element.parent]: parent },
        },
      };
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
      design: null,
      activeLayoutId: null,
      elementsByLayout: {},
      selectedElementId: null,
      highlightedElementId: null,
      fadingHighlightElementId: null,
      properties: [],
      propertyValues: {},
      initialized: false,
    }),
}));

export const useDesignStudioStore = DesignStudioStore;

// Stable empty map returned when no layout is active so
// selectors don't create a new reference on every call
const EMPTY_ELEMENTS: Record<string, FlatDesignElement> = {};

/**
 * Returns the element map of the active layout, or an empty map
 * when no layout is active.
 */
export const getActiveElements = (
  state: DesignStudioStore,
): Record<string, FlatDesignElement> => {
  if (!state.activeLayoutId) {
    return EMPTY_ELEMENTS;
  }

  return state.elementsByLayout[state.activeLayoutId] || EMPTY_ELEMENTS;
};

/**
 * Returns the layout currently being edited, or null when no
 * layout is active.
 */
export const getActiveLayout = (state: DesignStudioStore): Layout | null => {
  if (!state.design || !state.activeLayoutId) {
    return null;
  }

  return (
    state.design.layouts.find((layout) => layout.id === state.activeLayoutId) ||
    null
  );
};

export const useActiveLayoutType = (): LayoutType | null =>
  useDesignStudioStore((state) => getActiveLayout(state)?.type ?? null);

/**
 * Persists the design by reconstructing each layout's element
 * tree from its flat element map and writing the whole design.
 */
export const saveDesign = async () => {
  const { design, elementsByLayout } = DesignStudioStore.getState();

  if (!design) {
    return;
  }

  // Rebuild each layout's tree from its element bucket
  const layouts = design.layouts.map((layout) => {
    const elements = elementsByLayout[layout.id];

    if (!elements) {
      return layout;
    }

    return { ...layout, tree: reconstructTree(elements) };
  });

  const updated = await Designs.update(design.id, { layouts });

  DesignStudioStore.getState().setDesign(updated);
};

/**
 * Renames the design open in the studio.
 * @param name - The new design name.
 */
export const renameDesign = async (name: string) => {
  const design = DesignStudioStore.getState().design;

  if (!design) {
    return;
  }

  const updated = await Designs.update(design.id, { name });

  DesignStudioStore.getState().setDesign(updated);
};

/**
 * Adds a new layout to a design. If the design is open in the
 * studio, the layout's elements are added to the store and it
 * becomes the active layout.
 *
 * @param designId - The ID of the design to add the layout to.
 * @param type - The layout type.
 * @param position - The layout frame's position on the canvas.
 * @returns The new layout.
 */
export const addLayout = async (
  designId: string,
  type: LayoutType,
  position?: { x: number; y: number },
): Promise<Layout> => {
  const layout = await Layouts.create(designId, type, undefined, position);
  const state = DesignStudioStore.getState();

  if (state.design?.id === designId) {
    DesignStudioStore.setState({
      design: Designs.get(designId),
      elementsByLayout: {
        ...state.elementsByLayout,
        [layout.id]: flattenTree(layout.tree),
      },
      activeLayoutId: layout.id,
      selectedElementId: 'root',
      highlightedElementId: null,
      fadingHighlightElementId: null,
    });
  }

  return layout;
};

/**
 * Removes a layout from its design. If the design is open in the
 * studio, the layout's elements are dropped from the store and
 * the active layout is cleared if it was the removed one.
 *
 * @param layoutId - The ID of the layout to remove.
 */
export const removeLayout = async (layoutId: string) => {
  await Layouts.remove(layoutId);

  const state = DesignStudioStore.getState();

  if (!state.design || !(layoutId in state.elementsByLayout)) {
    return;
  }

  const { [layoutId]: removed, ...elementsByLayout } = state.elementsByLayout;
  const wasActive = state.activeLayoutId === layoutId;

  DesignStudioStore.setState({
    design: Designs.get(state.design.id),
    elementsByLayout,
    activeLayoutId: wasActive ? null : state.activeLayoutId,
    selectedElementId: wasActive ? null : state.selectedElementId,
  });
};

/**
 * Updates a layout's frame (position/size on the canvas) and
 * refreshes the design snapshot if the layout belongs to the
 * design open in the studio.
 *
 * @param layoutId - The ID of the layout to update.
 * @param frame - The new frame.
 */
export const updateLayoutFrame = async (
  layoutId: string,
  frame: LayoutFrame,
) => {
  await Layouts.update(layoutId, { frame });

  const state = DesignStudioStore.getState();

  if (state.design?.layouts.some((layout) => layout.id === layoutId)) {
    DesignStudioStore.getState().setDesign(Designs.get(state.design.id));
  }
};

export const getDesignElement = <
  TType extends
    | FlatDesignElement
    | FlatChildDesignElement
    | FlatParentDesignElement = FlatDesignElement,
>(
  id: string,
): TType => {
  const state = DesignStudioStore.getState();
  const layoutId = findElementLayoutId(state, id);

  return (layoutId ? state.elementsByLayout[layoutId][id] : undefined) as TType;
};

export const updateDesignElement = <T extends DesignElement>(
  id: string,
  updates: DesignElementUpdates<T>,
) => {
  const store = DesignStudioStore.getState();

  store.updateElement(id, updates);
  store.clearHighlight();
  saveDesign();
};

export const setDesignElement = (id: string, element: FlatDesignElement) => {
  const store = DesignStudioStore.getState();

  store.replaceElement(id, element);
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
  const element = useDesignStudioStore((state) => getActiveElements(state)[id]);

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
    useShallow((state) => selector(getActiveElements(state)[id] as TElement)),
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

/**
 * Finds the ID of the layout whose element map contains the given
 * element, preferring the active layout's bucket since root element
 * IDs are shared between layouts.
 */
function findElementLayoutId(
  state: DesignStudioStore,
  elementId: string,
): string | null {
  const { activeLayoutId, elementsByLayout } = state;

  if (activeLayoutId && elementsByLayout[activeLayoutId]?.[elementId]) {
    return activeLayoutId;
  }

  return (
    Object.keys(elementsByLayout).find(
      (layoutId) => elementId in elementsByLayout[layoutId],
    ) || null
  );
}
