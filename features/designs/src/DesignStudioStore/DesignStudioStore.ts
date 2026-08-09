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
  PagePanelSide,
  RootElement,
  disablePagePanel as disablePagePanelTree,
  enablePagePanel as enablePagePanelTree,
} from '@minddrop/designs';
import {
  PropertiesSchema,
  PropertyMap,
  PropertySchema,
} from '@minddrop/properties';
import { createStore, useShallow } from '@minddrop/stores';
import { deepMerge, entityId, reorderArray, uuid } from '@minddrop/utils';
import { useLayoutId } from '../LayoutIdContext';
import { CONTENT_ELEMENT_TYPES, DEFAULT_STATIC_ICON } from '../constants';
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
   * Handler invoked by saveDesign in place of persisting to the
   * designs store. Set when editing a standalone layout owned by
   * another entity.
   */
  saveHandler: ((layouts: Layout[]) => Promise<void> | void) | null;

  /**
   * Whether elements can be bound to design properties. Disabled
   * when editing a standalone layout with no property schema.
   */
  propertyBindingEnabled: boolean;

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
   * @param layoutId - The ID of the layout to add the element to. Resolved from the parent element when omitted.
   */
  addElement: (
    element: FlatDesignElement,
    parentId: string,
    index: number,
    layoutId?: string,
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
   * Replaces a layout's entire flat element map, e.g. after
   * applying a tree transform such as enabling a page panel.
   * @param layoutId - The ID of the layout to replace the elements of.
   * @param elements - The new flat element map.
   */
  replaceLayoutElements: (
    layoutId: string,
    elements: Record<string, FlatDesignElement>,
  ) => void;

  /**
   * Selects an element by ID, or deselects if null.
   * Also highlights the element on the canvas.
   * @param id - The ID of the element to select, or null to deselect.
   * @param layoutId - When provided, the layout containing the element becomes active.
   */
  selectElement: (id: string | null, layoutId?: string) => void;

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
  saveHandler: null,
  propertyBindingEnabled: true,

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
      saveHandler: null,
      propertyBindingEnabled: true,
      initialized: true,
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

  addElement: (element, parentId, index, targetLayoutId) => {
    set((state) => {
      // The new element goes into the specified layout, or the
      // layout containing the parent element
      const layoutId = targetLayoutId ?? findElementLayoutId(state, parentId);

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

  replaceLayoutElements: (layoutId, elements) => {
    set((state) => ({
      elementsByLayout: {
        ...state.elementsByLayout,
        [layoutId]: elements,
      },
    }));
  },

  selectElement: (id, layoutId) =>
    set((state) => ({
      activeLayoutId: layoutId ?? state.activeLayoutId,
      selectedElementId: id ?? 'root',
      highlightedElementId: id,
      fadingHighlightElementId: null,
    })),

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
      saveHandler: null,
      propertyBindingEnabled: true,
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
 * Returns the element map of the given layout when an ID is
 * provided, falling back to the active layout's elements.
 */
const getScopedElements = (
  state: DesignStudioStore,
  layoutId: string | null,
): Record<string, FlatDesignElement> => {
  if (!layoutId) {
    return getActiveElements(state);
  }

  return state.elementsByLayout[layoutId] || EMPTY_ELEMENTS;
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
 * When a save handler is set, persistence is delegated to it
 * instead of the designs store.
 */
export const saveDesign = async () => {
  const { design, elementsByLayout, saveHandler } =
    DesignStudioStore.getState();

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

  // Delegate persistence to the save handler when editing a
  // standalone layout
  if (saveHandler) {
    await saveHandler(layouts);

    // Keep the design snapshot in sync with the saved layouts
    DesignStudioStore.getState().setDesign({
      ...design,
      layouts,
      lastModified: new Date(),
    });

    return;
  }

  const updated = await Designs.update(design.id, { layouts });

  DesignStudioStore.getState().setDesign(updated);
};

export interface InitializeLayoutEditorOptions {
  /**
   * Called with the updated layout whenever an edit is saved.
   */
  onSave: (layout: Layout) => Promise<void> | void;

  /**
   * Whether elements can be bound to design properties.
   * @default false
   */
  propertyBinding?: boolean;
}

/**
 * Initializes the studio store for editing a single standalone
 * layout owned by another entity. Edits are persisted through the
 * onSave handler rather than the designs store.
 *
 * @param layout - The layout to edit.
 * @param options - The layout editor options.
 */
export const initializeLayoutEditor = (
  layout: Layout,
  options: InitializeLayoutEditorOptions,
) => {
  const store = DesignStudioStore.getState();

  // Wrap the layout in a synthetic design so the studio's design
  // based read paths work unchanged
  const design: Design = {
    id: entityId('design'),
    name: layout.name,
    properties: [],
    layouts: [layout],
    created: layout.created,
    lastModified: layout.lastModified,
  };

  // Initialize the store with the synthetic design
  store.initialize(design);

  // Activate the layout
  store.setActiveLayout(layout.id);

  // Persist edits through the save handler
  DesignStudioStore.setState({
    saveHandler: (layouts) => options.onSave(layouts[0]),
    propertyBindingEnabled: options.propertyBinding ?? false,
  });
};

/**
 * Clears the layout editor session.
 */
export const clearLayoutEditor = () => {
  DesignStudioStore.getState().clear();
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
 * Adds a property to the design open in the studio.
 *
 * @param property - The property schema to add.
 */
export const addDesignProperty = async (property: PropertySchema) => {
  const design = DesignStudioStore.getState().design;

  if (!design) {
    return;
  }

  const updated = await Designs.addProperty(design.id, property);

  DesignStudioStore.getState().setDesign(updated);
};

/**
 * Renames a property on the design open in the studio and
 * rebinds store elements bound to it.
 *
 * @param oldName - The current property name.
 * @param newName - The new property name.
 */
export const renameDesignProperty = async (
  oldName: string,
  newName: string,
) => {
  const state = DesignStudioStore.getState();

  if (!state.design) {
    return;
  }

  const updated = await Designs.renameProperty(
    state.design.id,
    oldName,
    newName,
  );

  DesignStudioStore.setState({
    design: updated,
    elementsByLayout: remapElementBindings(
      state.elementsByLayout,
      oldName,
      newName,
    ),
  });
};

/**
 * Updates a property on the design open in the studio. The
 * property is matched by name.
 *
 * @param property - The updated property schema.
 */
export const updateDesignProperty = async (property: PropertySchema) => {
  const design = DesignStudioStore.getState().design;

  if (!design) {
    return;
  }

  const updated = await Designs.updateProperty(design.id, property);

  DesignStudioStore.getState().setDesign(updated);
};

/**
 * Replaces the properties of the design open in the studio,
 * used to reorder them.
 *
 * @param properties - The reordered properties schema.
 */
export const updateDesignProperties = async (properties: PropertiesSchema) => {
  const design = DesignStudioStore.getState().design;

  if (!design) {
    return;
  }

  // Apply the new order to the studio snapshot immediately so
  // the sorted list doesn't flash back to the old order while
  // the update persists
  DesignStudioStore.getState().setDesign({ ...design, properties });

  const updated = await Designs.update(design.id, { properties });

  DesignStudioStore.getState().setDesign(updated);
};

/**
 * Removes a property from the design open in the studio and
 * unbinds store elements bound to it.
 *
 * @param propertyName - The name of the property to remove.
 */
export const removeDesignProperty = async (propertyName: string) => {
  const state = DesignStudioStore.getState();

  if (!state.design) {
    return;
  }

  const updated = await Designs.removeProperty(state.design.id, propertyName);

  DesignStudioStore.setState({
    design: updated,
    elementsByLayout: remapElementBindings(
      state.elementsByLayout,
      propertyName,
      null,
    ),
  });
};

/**
 * Returns the element buckets with bindings of the given property
 * rebound to the new name, or unbound when the new name is null.
 */
function remapElementBindings(
  elementsByLayout: Record<string, Record<string, FlatDesignElement>>,
  propertyName: string,
  newPropertyName: string | null,
): Record<string, Record<string, FlatDesignElement>> {
  return Object.fromEntries(
    Object.entries(elementsByLayout).map(([layoutId, elements]) => [
      layoutId,
      Object.fromEntries(
        Object.entries(elements).map(([elementId, element]) => [
          elementId,
          element.property === propertyName
            ? { ...element, property: newPropertyName || undefined }
            : element,
        ]),
      ),
    ]),
  );
}

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

/**
 * Renames a layout and refreshes the design snapshot if the
 * layout belongs to the design open in the studio.
 *
 * @param layoutId - The ID of the layout to rename.
 * @param name - The new layout name.
 */
export const renameLayout = async (layoutId: string, name: string) => {
  await Layouts.update(layoutId, { name });

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
  layoutId?: string,
): TType => {
  const state = DesignStudioStore.getState();
  const resolvedLayoutId = layoutId ?? findElementLayoutId(state, id);

  return (
    resolvedLayoutId
      ? state.elementsByLayout[resolvedLayoutId]?.[id]
      : undefined
  ) as TType;
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
  // Free-form content can't be dropped into the panel row itself
  if (newParentId === 'root' && isActiveRootPanelled()) {
    return;
  }

  const store = DesignStudioStore.getState();

  store.moveElement(id, newParentId, index);
  selectDroppedElement(id);
  saveDesign();
};

export const sortDesignElement = (elementId: string, targetIndex: number) => {
  const store = DesignStudioStore.getState();

  store.sortElement(elementId, targetIndex);
  selectDroppedElement(elementId);
  saveDesign();
};

export const addDeisgnElementFromTemplate = (
  template: DesignElementTemplate,
  parentId: string,
  index: number,
  layoutId?: string,
) => {
  // New elements can't be dropped into the panel row itself
  if (parentId === 'root' && isActiveRootPanelled()) {
    return;
  }

  const state = DesignStudioStore.getState();

  const element = {
    ...template,
    id: uuid(),
    parent: parentId,
  } as FlatDesignElement;

  // Without property binding, content elements start in static
  // mode so they are immediately editable
  if (
    !state.propertyBindingEnabled &&
    CONTENT_ELEMENT_TYPES.includes(element.type)
  ) {
    element.static = true;

    // Default the icon so static mode has a visible value
    if (element.type === 'icon' && !element.icon) {
      element.icon = DEFAULT_STATIC_ICON;
    }
  }

  state.addElement(element, parentId, index, layoutId);
  selectDroppedElement(element.id, layoutId);
  saveDesign();
};

export interface DeleteHighlightedElementOptions {
  /**
   * Whether highlighting the root element deletes the entire
   * layout.
   * @default false
   */
  allowRootDelete?: boolean;
}

/**
 * Deletes the highlighted element. Panelled regions are protected:
 * deleting a page panel disables it, and the content region of a
 * panelled root cannot be deleted.
 *
 * @param options - The deletion options.
 */
export const deleteHighlightedElement = (
  options: DeleteHighlightedElementOptions = {},
) => {
  const store = DesignStudioStore.getState();
  const { highlightedElementId, activeLayoutId } = store;

  // Nothing highlighted to delete
  if (!highlightedElementId) {
    return;
  }

  // Deleting the root deletes the entire layout, when allowed
  if (highlightedElementId === 'root') {
    if (options.allowRootDelete && activeLayoutId) {
      removeLayout(activeLayoutId);
    }

    return;
  }

  const element = getDesignElement(highlightedElementId);

  // The content region of a panelled root cannot be deleted
  if (element?.type === 'container' && element.role === 'content') {
    return;
  }

  // Deleting a panel disables it, discarding its contents
  if (element?.type === 'page-panel') {
    removePagePanel(element.side);

    return;
  }

  // Remove the element and persist
  store.removeElement(highlightedElementId);
  store.selectElement(null);
  saveDesign();
};

/**
 * Enables a panel on the given side of the active layout's page
 * root, wrapping its content into a content region as needed.
 * @param side - The side to add the panel to.
 */
export const addPagePanel = (side: PagePanelSide) => {
  applyPagePanelTransform((root) => enablePagePanelTree(root, side));
};

/**
 * Disables the panel on the given side of the active layout's page
 * root, discarding its contents.
 * @param side - The side whose panel to remove.
 */
export const removePagePanel = (side: PagePanelSide) => {
  applyPagePanelTransform((root) => disablePagePanelTree(root, side));
};

/**
 * Applies a page-root tree transform to the active layout by
 * reconstructing its tree, transforming it, and re-flattening the
 * result back into the store.
 */
const applyPagePanelTransform = (
  transform: (root: RootElement) => RootElement,
) => {
  const state = DesignStudioStore.getState();
  const layoutId = state.activeLayoutId;

  if (!layoutId) {
    return;
  }

  const elements = state.elementsByLayout[layoutId];

  if (!elements) {
    return;
  }

  const root = reconstructTree(elements);

  state.replaceLayoutElements(layoutId, flattenTree(transform(root)));
  state.selectElement('root', layoutId);
  saveDesign();
};

/**
 * Whether the active layout's root is panelled. Used to reject
 * dropping free-form content directly into the panel row.
 */
const isActiveRootPanelled = (): boolean => {
  const state = DesignStudioStore.getState();
  const layoutId = state.activeLayoutId;

  if (!layoutId) {
    return false;
  }

  const elements = state.elementsByLayout[layoutId];
  const root = elements?.['root'];

  if (!root || !('children' in root)) {
    return false;
  }

  return root.children.some((childId) => {
    const child = elements[childId];

    if (!child) {
      return false;
    }

    if (child.type === 'page-panel') {
      return true;
    }

    return child.type === 'container' && child.role === 'content';
  });
};

/**
 * Selects a dropped element and activates its layout.
 * @param elementId - The ID of the dropped element.
 * @param layoutId - The ID of the layout containing the element. Resolved from the element when omitted.
 */
const selectDroppedElement = (elementId: string, layoutId?: string) => {
  const state = DesignStudioStore.getState();
  const resolvedLayoutId =
    layoutId ?? findElementLayoutId(state, elementId) ?? undefined;

  state.selectElement(elementId, resolvedLayoutId);
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
  const layoutId = useLayoutId();
  const element = useDesignStudioStore(
    (state) => getScopedElements(state, layoutId)[id],
  );

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
  const layoutId = useLayoutId();

  return useDesignStudioStore(
    useShallow((state) =>
      selector(getScopedElements(state, layoutId)[id] as TElement),
    ),
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
