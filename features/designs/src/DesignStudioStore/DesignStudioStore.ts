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
  disablePagePanel,
  enablePagePanel,
  getElementCompatiblePropertyTypes,
  getElementConfig,
  resolveAutoBinding,
  resolveDesignMediaDirPath,
} from '@minddrop/designs';
import {
  PropertiesSchema,
  PropertyMap,
  PropertySchema,
  PropertyType,
} from '@minddrop/properties';
import { StoreApi, createVanillaStore } from '@minddrop/stores';
import { deepMerge, entityId, reorderArray, uuid } from '@minddrop/utils';
import {
  FlatChildDesignElement,
  FlatDesignElement,
  FlatParentDesignElement,
} from '../types';
import { flattenTree, reconstructTree } from '../utils';

// How long editing pauses before the design is persisted, so a
// burst of edits (dragging a slider, typing) writes once
const SAVE_DEBOUNCE_MS = 500;

// How long repeated edits to the same target keep extending a single
// undo step rather than starting a new one
const HISTORY_COALESCE_WINDOW_MS = 800;

// The most undo steps kept before the oldest is dropped
const UNDO_STACK_LIMIT = 50;

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
export type DesignElementUpdates<T> = T extends unknown
  ? DeepPartialOne<Omit<T, 'id' | 'type'>>
  : never;

/**
 * Union of every key present on any element style type.
 */
export type DesignElementStyleKey = DesignElementStyle extends infer T
  ? T extends unknown
    ? keyof T
    : never
  : never;

/**
 * The value type of a style key across the element style union.
 */
export type DesignElementStyleValue<K extends DesignElementStyleKey> =
  DesignElementStyle extends infer T
    ? T extends unknown
      ? K extends keyof T
        ? T[K]
        : never
      : never
    : never;

// Stable empty map returned when no layout is active so
// selectors don't create a new reference on every call
const EMPTY_ELEMENTS: Record<string, FlatDesignElement> = {};

/**
 * A restorable snapshot of the design content. Covers exactly what
 * the save path persists, so restoring a step never reverts state
 * that is written elsewhere (the design's name and properties).
 */
export interface DesignStudioSnapshot {
  /**
   * The design's layouts, holding each layout's frame and name.
   */
  layouts: Layout[];

  /**
   * The elements of each layout, as a
   * [layoutId]: { [elementId]: FlatDesignElement } map.
   */
  elementsByLayout: Record<string, Record<string, FlatDesignElement>>;
}

export interface DesignStudioState {
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
   * The path to the media directory of the entity owning the layout
   * being edited, or null if none.
   */
  mediaDirPath: string | null;

  /**
   * The snapshots undo restores, oldest first. Subscribe to its
   * length to drive an undo control's enabled state.
   */
  undoStack: DesignStudioSnapshot[];

  /**
   * The snapshots redo restores, oldest first. Cleared whenever a
   * new edit is made.
   */
  redoStack: DesignStudioSnapshot[];
}

export interface InitializeLayoutEditorOptions {
  /**
   * Called with the updated layout whenever an edit is saved.
   */
  onSave: (layout: Layout) => Promise<void> | void;

  /**
   * The path to the media directory of the entity owning the layout,
   * where media added to its elements is stored.
   */
  mediaDirPath: string;

  /**
   * Whether elements can be bound to design properties.
   * @default false
   */
  propertyBinding?: boolean;
}

export interface DeleteHighlightedElementOptions {
  /**
   * Whether highlighting the root element deletes the entire
   * layout.
   * @default false
   */
  allowRootDelete?: boolean;
}

export interface DesignStudioStore {
  /**
   * The internal store, for selector subscriptions.
   */
  store: StoreApi<DesignStudioState>;

  /**
   * Returns whether the store has been initialized.
   */
  isInitialized(): boolean;

  /**
   * Returns the design being edited, or null if none.
   */
  getDesign(): Design | null;

  /**
   * Returns the ID of the layout currently being edited, or null
   * if none.
   */
  getActiveLayoutId(): string | null;

  /**
   * Returns the elements of each of the design's layouts as a
   * [layoutId]: { [elementId]: FlatDesignElement } map.
   */
  getElementsByLayout(): Record<string, Record<string, FlatDesignElement>>;

  /**
   * Returns a layout's flat element map, or an empty map if the
   * layout has no elements in the store.
   *
   * @param layoutId - The ID of the layout to get the elements of.
   */
  getElements(layoutId: string): Record<string, FlatDesignElement>;

  /**
   * Returns a layout with its tree rebuilt from the store's live
   * elements, rather than the last persisted tree carried by the
   * design snapshot. Saves are debounced, so anything reading a
   * layout's tree to reason about the current edit (such as
   * resolving which properties are already bound) has to rebuild it.
   *
   * @param layoutId - The ID of the layout to build. Falls back to the active layout when omitted.
   * @returns The layout with its live tree, or null when the layout cannot be resolved.
   */
  getLiveLayout(layoutId?: string): Layout | null;

  /**
   * Returns the ID of the currently selected element, or null if
   * none.
   */
  getSelectedElementId(): string | null;

  /**
   * Returns the ID of the element highlighted on the canvas, or
   * null if none.
   */
  getHighlightedElementId(): string | null;

  /**
   * Returns the ID of the element whose highlight is fading out,
   * or null if none.
   */
  getFadingHighlightElementId(): string | null;

  /**
   * Returns the properties of the design's parent.
   */
  getProperties(): PropertiesSchema;

  /**
   * Returns the values of the parent's properties.
   */
  getPropertyValues(): PropertyMap;

  /**
   * Returns the handler invoked by saveDesign in place of
   * persisting to the designs store, or null if none is set.
   */
  getSaveHandler(): ((layouts: Layout[]) => Promise<void> | void) | null;

  /**
   * Returns whether elements can be bound to design properties.
   */
  isPropertyBindingEnabled(): boolean;

  /**
   * Returns the media directory path of the entity owning the
   * layout being edited, or null if none is set.
   */
  getMediaDirPath(): string | null;

  /**
   * Initializes the store with a design, flattening each of its
   * layouts' element trees. No layout is active until one is
   * selected via setActiveLayout.
   *
   * @param design - The design to edit.
   * @param properties - The parent's properties.
   * @param propertyValues - The parent's property values.
   */
  initialize(
    design: Design,
    properties?: PropertiesSchema,
    propertyValues?: PropertyMap,
  ): void;

  /**
   * Replaces the design snapshot without re-flattening elements.
   *
   * @param design - The updated design.
   */
  setDesign(design: Design): void;

  /**
   * Sets the active layout, or clears it when null. Selects the
   * layout's root element and clears any highlight.
   *
   * @param layoutId - The ID of the layout to activate, or null.
   */
  setActiveLayout(layoutId: string | null): void;

  /**
   * Adds an element to the layout containing the parent element.
   *
   * @param element - The element to add.
   * @param parentId - The ID of the parent element.
   * @param index - The index to add the element at.
   * @param layoutId - The ID of the layout to add the element to. Resolved from the parent element when omitted.
   */
  addElement(
    element: FlatDesignElement,
    parentId: string,
    index: number,
    layoutId?: string,
  ): void;

  /**
   * Updates the properties of an element.
   *
   * @param id - The ID of the element to update.
   * @param updates - The updates to apply to the element.
   */
  updateElement(id: string, updates: DesignElementUpdates<DesignElement>): void;

  /**
   * Replaces an element outright, e.g. to remove a property
   * that a deep merge cannot unset.
   *
   * @param id - The ID of the element to replace.
   * @param element - The new element.
   */
  replaceElement(id: string, element: FlatDesignElement): void;

  /**
   * Moves an element to a new parent.
   *
   * @param id - The ID of the element to move.
   * @param newParentId - The ID of the new parent element.
   * @param index - The index to move the element to.
   */
  moveElement(id: string, newParentId: string, index: number): void;

  /**
   * Sorts an element to a new index within its parent.
   *
   * @param elementId - The ID of the element to sort.
   * @param targetIndex - The index to sort the element to.
   */
  sortElement(elementId: string, targetIndex: number): void;

  /**
   * Removes an element from the store.
   *
   * @param id - The ID of the element to remove.
   */
  removeElement(id: string): void;

  /**
   * Replaces a layout's entire flat element map, e.g. after
   * applying a tree transform such as enabling a page panel.
   *
   * @param layoutId - The ID of the layout to replace the elements of.
   * @param elements - The new flat element map.
   */
  replaceLayoutElements(
    layoutId: string,
    elements: Record<string, FlatDesignElement>,
  ): void;

  /**
   * Selects an element by ID, or deselects if null.
   * Also highlights the element on the canvas.
   *
   * @param id - The ID of the element to select, or null to deselect.
   * @param layoutId - When provided, the layout containing the element becomes active.
   */
  selectElement(id: string | null, layoutId?: string): void;

  /**
   * Clears the canvas highlight with a fade-out animation.
   */
  clearHighlight(): void;

  /**
   * Clears the fading highlight after the animation completes.
   */
  clearFadingHighlight(): void;

  /**
   * Resets the store to its initial state.
   */
  clear(): void;

  /**
   * Returns whether there is a step to undo.
   */
  canUndo(): boolean;

  /**
   * Returns whether there is a step to redo.
   */
  canRedo(): boolean;

  /**
   * Restores the previous history step, moving the current content
   * onto the redo stack. Does nothing when there is nothing to undo.
   */
  undo(): void;

  /**
   * Restores the next history step, moving the current content back
   * onto the undo stack. Does nothing when there is nothing to redo.
   */
  redo(): void;

  /**
   * Persists the design by reconstructing each layout's element
   * tree from its flat element map and writing the whole design.
   * When a save handler is set, persistence is delegated to it
   * instead of the designs store.
   */
  saveDesign(): Promise<void>;

  /**
   * Persists the design once editing pauses, so a burst of edits
   * results in a single write.
   */
  scheduleSave(): void;

  /**
   * Persists a pending scheduled save immediately and waits for any
   * in-flight write to settle.
   */
  flushSave(): Promise<void>;

  /**
   * Initializes the studio store for editing a single standalone
   * layout owned by another entity. Edits are persisted through the
   * onSave handler rather than the designs store.
   *
   * @param layout - The layout to edit.
   * @param options - The layout editor options.
   */
  initializeLayoutEditor(
    layout: Layout,
    options: InitializeLayoutEditorOptions,
  ): void;

  /**
   * Clears the layout editor session.
   */
  clearLayoutEditor(): void;

  /**
   * Renames the design open in the studio.
   *
   * @param name - The new design name.
   */
  renameDesign(name: string): Promise<void>;

  /**
   * Returns a property of the design open in the studio, matched by
   * name, or null if the design has no such property.
   *
   * @param name - The property name.
   * @returns The property schema, or null.
   */
  getDesignProperty(name: string): PropertySchema | null;

  /**
   * Adds a property to the design open in the studio.
   *
   * @param property - The property schema to add.
   */
  addDesignProperty(property: PropertySchema): Promise<void>;

  /**
   * Renames a property on the design open in the studio and
   * rebinds store elements bound to it.
   *
   * @param oldName - The current property name.
   * @param newName - The new property name.
   */
  renameDesignProperty(oldName: string, newName: string): Promise<void>;

  /**
   * Updates a property on the design open in the studio. The
   * property is matched by name.
   *
   * @param property - The updated property schema.
   */
  updateDesignProperty(property: PropertySchema): Promise<void>;

  /**
   * Replaces the properties of the design open in the studio,
   * used to reorder them.
   *
   * @param properties - The reordered properties schema.
   */
  updateDesignProperties(properties: PropertiesSchema): Promise<void>;

  /**
   * Removes a property from the design open in the studio and
   * unbinds store elements bound to it.
   *
   * @param propertyName - The name of the property to remove.
   */
  removeDesignProperty(propertyName: string): Promise<void>;

  /**
   * Adds a new layout to a design. If the design is open in the
   * studio, the layout's elements are added to the store and it
   * becomes the active layout.
   *
   * @param designId - The ID of the design to add the layout to.
   * @param type - The layout type.
   * @param position - The layout frame's position on the canvas,
   *   which is where the user dropped it.
   * @returns The new layout.
   */
  addLayout(
    designId: string,
    type: LayoutType,
    position: { x: number; y: number },
  ): Promise<Layout>;

  /**
   * Removes a layout from its design. If the design is open in the
   * studio, the layout's elements are dropped from the store and
   * the active layout is cleared if it was the removed one.
   *
   * @param layoutId - The ID of the layout to remove.
   */
  removeLayout(layoutId: string): Promise<void>;

  /**
   * Updates a layout's frame (position/size on the canvas) and
   * refreshes the design snapshot if the layout belongs to the
   * design open in the studio.
   *
   * @param layoutId - The ID of the layout to update.
   * @param frame - The new frame.
   */
  updateLayoutFrame(layoutId: string, frame: LayoutFrame): Promise<void>;

  /**
   * Renames a layout and refreshes the design snapshot if the
   * layout belongs to the design open in the studio.
   *
   * @param layoutId - The ID of the layout to rename.
   * @param name - The new layout name.
   */
  renameLayout(layoutId: string, name: string): Promise<void>;

  /**
   * Returns an element from the store, resolved against the given
   * layout, falling back to whichever layout contains it.
   *
   * @param id - The ID of the element to get.
   * @param layoutId - The ID of the layout containing the element.
   */
  getDesignElement<
    TType extends
      | FlatDesignElement
      | FlatChildDesignElement
      | FlatParentDesignElement = FlatDesignElement,
  >(
    id: string,
    layoutId?: string,
  ): TType;

  /**
   * Updates an element and persists the design.
   *
   * @param id - The ID of the element to update.
   * @param updates - The updates to apply to the element.
   */
  updateDesignElement<T extends DesignElement>(
    id: string,
    updates: DesignElementUpdates<T>,
  ): void;

  /**
   * Replaces an element outright and persists the design.
   *
   * @param id - The ID of the element to replace.
   * @param element - The new element.
   */
  setDesignElement(id: string, element: FlatDesignElement): void;

  /**
   * Binds an element to the first compatible design property left
   * unbound in its layout, leaving it as it is when none qualifies.
   *
   * @param id - The ID of the element to bind.
   */
  autoBindDesignElement(id: string): void;

  /**
   * Moves an element to a new parent and persists the design.
   *
   * @param id - The ID of the element to move.
   * @param newParentId - The ID of the new parent element.
   * @param index - The index to move the element to.
   */
  moveDesignElement(id: string, newParentId: string, index: number): void;

  /**
   * Sorts an element within its parent and persists the design.
   *
   * @param elementId - The ID of the element to sort.
   * @param targetIndex - The index to sort the element to.
   */
  sortDesignElement(elementId: string, targetIndex: number): void;

  /**
   * Creates an element from a template, adds it to the given parent
   * and persists the design.
   *
   * @param template - The element template.
   * @param parentId - The ID of the parent element.
   * @param index - The index to add the element at.
   * @param layoutId - The ID of the layout to add the element to. Resolved from the parent element when omitted.
   */
  addDesignElementFromTemplate(
    template: DesignElementTemplate,
    parentId: string,
    index: number,
    layoutId?: string,
  ): void;

  /**
   * Deletes the highlighted element. Panelled regions are protected:
   * deleting a page panel disables it, and the content region of a
   * panelled root cannot be deleted.
   *
   * @param options - The deletion options.
   */
  deleteHighlightedElement(options?: DeleteHighlightedElementOptions): void;

  /**
   * Enables a panel on the given side of the active layout's page
   * root, wrapping its content into a content region as needed.
   *
   * @param side - The side to add the panel to.
   */
  addPagePanel(side: PagePanelSide): void;

  /**
   * Disables the panel on the given side of the active layout's page
   * root, discarding its contents.
   *
   * @param side - The side whose panel to remove.
   */
  removePagePanel(side: PagePanelSide): void;

  /**
   * Sets or unsets a single style key on an element and persists
   * the design. Passing undefined removes the key, since an omitted
   * key means no CSS is emitted.
   *
   * @param id - The ID of the element to update.
   * @param key - The style key to set.
   * @param value - The style value, or undefined to unset.
   */
  updateElementStyle<K extends DesignElementStyleKey>(
    id: string,
    key: K,
    value: DesignElementStyleValue<K> | undefined,
  ): void;
}

/**
 * Creates an instance-scoped design studio store. Each studio host
 * (the design studio view, a standalone layout editor) creates its
 * own instance so multiple editors can coexist.
 */
export function createDesignStudioStore(): DesignStudioStore {
  // The internal store holding the editor state
  const store = createVanillaStore<DesignStudioState>(() => initialState());

  // The pending debounced save, or null when none is scheduled
  let saveTimer: ReturnType<typeof setTimeout> | null = null;

  // Serializes writes so they apply in the order they were made
  let saveChain: Promise<void> = Promise.resolve();

  // The target of the most recent history step, used to fold
  // repeated edits to that target into a single step
  let lastCoalesceKey: string | null = null;

  // When the most recent history step was committed
  let lastCommitTime = 0;

  /**
   * Merges a partial state update into the store.
   */
  function set(
    updates:
      | Partial<DesignStudioState>
      | ((state: DesignStudioState) => Partial<DesignStudioState>),
  ): void {
    store.setState(updates);
  }

  /**
   * Returns an element from the store, resolved against the given
   * layout, falling back to whichever layout contains it.
   */
  function getDesignElement<
    TType extends
      | FlatDesignElement
      | FlatChildDesignElement
      | FlatParentDesignElement = FlatDesignElement,
  >(id: string, layoutId?: string): TType {
    const state = store.getState();
    const resolvedLayoutId = layoutId ?? findElementLayoutId(state, id);

    return (
      resolvedLayoutId
        ? state.elementsByLayout[resolvedLayoutId]?.[id]
        : undefined
    ) as TType;
  }

  const api: DesignStudioStore = {
    store,

    isInitialized: () => store.getState().initialized,
    getDesign: () => store.getState().design,
    getActiveLayoutId: () => store.getState().activeLayoutId,
    getElementsByLayout: () => store.getState().elementsByLayout,
    getElements: (layoutId) =>
      store.getState().elementsByLayout[layoutId] || EMPTY_ELEMENTS,
    getLiveLayout: (layoutId) => {
      const { design, activeLayoutId, elementsByLayout } = store.getState();

      // Layouts are always resolved against the open design
      if (!design) {
        return null;
      }

      // Fall back to the active layout when no layout is given
      const resolvedLayoutId = layoutId ?? activeLayoutId;
      const layout = design.layouts.find(
        (candidate) => candidate.id === resolvedLayoutId,
      );

      if (!layout) {
        return null;
      }

      const elements = resolvedLayoutId
        ? elementsByLayout[resolvedLayoutId]
        : undefined;

      // A layout with no elements in the store has not been edited,
      // so its persisted tree is already current
      if (!elements) {
        return layout;
      }

      // Rebuild the tree from the live elements, which hold every
      // edit made since the last save
      return { ...layout, tree: reconstructTree(elements) };
    },
    getSelectedElementId: () => store.getState().selectedElementId,
    getHighlightedElementId: () => store.getState().highlightedElementId,
    getFadingHighlightElementId: () =>
      store.getState().fadingHighlightElementId,
    getProperties: () => store.getState().properties,
    getPropertyValues: () => store.getState().propertyValues,
    getSaveHandler: () => store.getState().saveHandler,
    isPropertyBindingEnabled: () => store.getState().propertyBindingEnabled,
    getMediaDirPath: () => store.getState().mediaDirPath,

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
        mediaDirPath: resolveDesignMediaDirPath(design.id),
        initialized: true,
        undoStack: [],
        redoStack: [],
      });

      // Edits to the opened design start their own history step
      lastCoalesceKey = null;
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

        // Insert the new element's ID into the parent's children
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

        // Deep merge so nested objects (style, format) update
        // per-key rather than being replaced
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
        // Moving within one parent must not copy it twice, or the
        // removal and the insertion land on separate copies and the
        // last one written wins, duplicating the element
        const newParent =
          newParentId === element.parent
            ? oldParent
            : { ...elements[newParentId] };

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

        // Remove from the old parent
        oldParent.children = [...oldParent.children];
        oldParent.children.splice(oldParent.children.indexOf(id), 1);

        // Insert into the new one, copying its children only when it
        // is a different element to the one just spliced
        if (newParent !== oldParent) {
          newParent.children = [...newParent.children];
        }

        newParent.children.splice(index, 0, id);

        // Rewire the element to its new parent
        element.parent = newParentId;

        return {
          elementsByLayout: {
            ...state.elementsByLayout,
            [layoutId]: {
              ...elements,
              [oldParent.id]: oldParent,
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
        const parentElement = elements[
          element.parent
        ] as FlatParentDesignElement;

        // Reorder the element within its parent's children
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

        // Split the element out of the layout's bucket
        const { [id]: element, ...rest } = state.elementsByLayout[layoutId];

        if (!('parent' in element)) {
          throw new Error(`Cannot remove root element.`);
        }

        const parent = { ...rest[element.parent] };

        // Drop the element from its parent's children
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

    clear: () => {
      // Persist any pending edit before dropping the state it
      // lives in, so closing the studio never loses work. Nothing
      // awaits the close, so a failed write is contained.
      void api.flushSave().catch(() => undefined);

      set(initialState());

      // The next edit starts a fresh history step
      lastCoalesceKey = null;
    },

    canUndo: () => store.getState().undoStack.length > 0,

    canRedo: () => store.getState().redoStack.length > 0,

    undo: () => {
      const state = store.getState();
      const previous = state.undoStack[state.undoStack.length - 1];

      // Nothing to undo
      if (!previous) {
        return;
      }

      // The current content becomes the step redo returns to
      restoreSnapshot(previous, {
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, captureSnapshot(state)!],
      });
    },

    redo: () => {
      const state = store.getState();
      const next = state.redoStack[state.redoStack.length - 1];

      // Nothing to redo
      if (!next) {
        return;
      }

      // The current content becomes the step undo returns to
      restoreSnapshot(next, {
        undoStack: [...state.undoStack, captureSnapshot(state)!],
        redoStack: state.redoStack.slice(0, -1),
      });
    },

    saveDesign: () => {
      // An immediate save supersedes any pending debounced one,
      // since both write the same state
      cancelScheduledSave();

      return enqueueSave();
    },

    scheduleSave: () => {
      // Restart the window so a burst of edits writes once, when
      // editing pauses
      cancelScheduledSave();

      saveTimer = setTimeout(() => {
        saveTimer = null;

        // Nothing awaits a scheduled save, so a failed write is
        // contained here rather than surfacing as an unhandled
        // rejection. Callers needing the outcome await saveDesign.
        void enqueueSave().catch(() => undefined);
      }, SAVE_DEBOUNCE_MS);
    },

    flushSave: async () => {
      // Persist the pending edit immediately when one is scheduled
      if (saveTimer !== null) {
        await api.saveDesign();

        return;
      }

      // Otherwise just wait for any in-flight write to settle
      await saveChain;
    },

    initializeLayoutEditor: (layout, options) => {
      // Wrap the layout in a synthetic design so the studio's design
      // based read paths work unchanged
      const design: Design = {
        id: entityId('design'),
        type: 'database',
        name: layout.name,
        properties: [],
        layouts: [layout],
        created: layout.created,
        lastModified: layout.lastModified,
      };

      // Initialize the store with the synthetic design
      api.initialize(design);

      // Activate the layout
      api.setActiveLayout(layout.id);

      // Persist edits through the save handler, storing media in the
      // owner's media directory rather than the synthetic design's
      set({
        saveHandler: (layouts) => options.onSave(layouts[0]),
        propertyBindingEnabled: options.propertyBinding ?? false,
        mediaDirPath: options.mediaDirPath,
      });
    },

    clearLayoutEditor: () => {
      api.clear();
    },

    renameDesign: async (name) => {
      const design = api.getDesign();

      if (!design) {
        return;
      }

      const updated = await Designs.update(design.id, { name });

      api.setDesign(updated);
    },

    getDesignProperty: (name) => {
      const design = api.getDesign();

      // Only database designs carry properties
      if (!design || design.type !== 'database') {
        return null;
      }

      return (
        design.properties.find((property) => property.name === name) || null
      );
    },

    addDesignProperty: async (property) => {
      const design = api.getDesign();

      if (!design) {
        return;
      }

      const updated = await Designs.addProperty(design.id, property);

      api.setDesign(updated);
    },

    renameDesignProperty: async (oldName, newName) => {
      const design = api.getDesign();

      if (!design) {
        return;
      }

      const updated = await Designs.renameProperty(design.id, oldName, newName);

      // Rebind store elements bound to the renamed property
      set({
        design: updated,
        elementsByLayout: remapElementBindings(
          api.getElementsByLayout(),
          oldName,
          newName,
        ),
      });
    },

    updateDesignProperty: async (property) => {
      const design = api.getDesign();

      if (!design) {
        return;
      }

      const updated = await Designs.updateProperty(design.id, property);

      api.setDesign(updated);
    },

    updateDesignProperties: async (properties) => {
      const design = api.getDesign();

      if (!design || design.type !== 'database') {
        return;
      }

      // Apply the new order to the studio snapshot immediately so
      // the sorted list doesn't flash back to the old order while
      // the update persists
      api.setDesign({ ...design, properties });

      const updated = await Designs.update(design.id, { properties });

      api.setDesign(updated);
    },

    removeDesignProperty: async (propertyName) => {
      const design = api.getDesign();

      if (!design) {
        return;
      }

      const updated = await Designs.removeProperty(design.id, propertyName);

      // Unbind store elements bound to the removed property
      set({
        design: updated,
        elementsByLayout: remapElementBindings(
          api.getElementsByLayout(),
          propertyName,
          null,
        ),
      });
    },

    addLayout: async (designId, type, position) => {
      // Snapshot before the layout reaches the design, so undo
      // restores the design without it
      if (api.getDesign()?.id === designId) {
        commitHistory();
      }

      const layout = await Layouts.create(designId, { type, position });

      // When the design is open in the studio, add the layout's
      // elements and make it the active layout
      if (api.getDesign()?.id === designId) {
        set({
          design: Designs.get(designId),
          elementsByLayout: {
            ...api.getElementsByLayout(),
            [layout.id]: flattenTree(layout.tree),
          },
          activeLayoutId: layout.id,
          selectedElementId: 'root',
          highlightedElementId: null,
          fadingHighlightElementId: null,
        });
      }

      return layout;
    },

    removeLayout: async (layoutId) => {
      // Snapshot while the layout and its elements are still in the
      // store, so undo can restore both
      if (layoutId in api.getElementsByLayout()) {
        commitHistory();
      }

      await Layouts.remove(layoutId);

      const design = api.getDesign();
      const allElements = api.getElementsByLayout();

      if (!design || !(layoutId in allElements)) {
        return;
      }

      // Drop the layout's element bucket
      const { [layoutId]: removed, ...elementsByLayout } = allElements;
      const activeLayoutId = api.getActiveLayoutId();
      const wasActive = activeLayoutId === layoutId;

      set({
        design: Designs.get(design.id),
        elementsByLayout,
        activeLayoutId: wasActive ? null : activeLayoutId,
        selectedElementId: wasActive ? null : api.getSelectedElementId(),
      });
    },

    updateLayoutFrame: async (layoutId, frame) => {
      await Layouts.update(layoutId, { frame });

      const design = api.getDesign();

      // Refresh the snapshot when the layout is open in the studio
      if (design?.layouts.some((layout) => layout.id === layoutId)) {
        api.setDesign(Designs.get(design.id));
      }
    },

    renameLayout: async (layoutId, name) => {
      await Layouts.update(layoutId, { name });

      const design = api.getDesign();

      // Refresh the snapshot when the layout is open in the studio
      if (design?.layouts.some((layout) => layout.id === layoutId)) {
        api.setDesign(Designs.get(design.id));
      }
    },

    getDesignElement,

    updateDesignElement: (id, updates) => {
      // Typing into one element's content is a single undo step
      commitHistory(`${id}:content`);

      api.updateElement(id, updates as DesignElementUpdates<DesignElement>);
      api.clearHighlight();
      api.scheduleSave();
    },

    setDesignElement: (id, element) => {
      commitHistory();

      api.replaceElement(id, element);
      api.clearHighlight();
      api.scheduleSave();
    },

    autoBindDesignElement: (id) => {
      const element = api.getDesignElement(id);

      // Nothing to bind without an element
      if (!element) {
        return;
      }

      // An existing binding is the user's choice, so it is kept
      if (element.property) {
        return;
      }

      const compatiblePropertyTypes =
        getElementCompatiblePropertyTypes(element);

      // Elements which render no property have nothing to bind
      if (compatiblePropertyTypes.length === 0) {
        return;
      }

      const design = api.getDesign();

      // Bindings are resolved against the open design's properties
      if (!design) {
        return;
      }

      // Resolve against the live layout, since a property bound by
      // an edit made since the last save is still taken
      const layout = api.getLiveLayout();

      if (!layout) {
        return;
      }

      const property = resolveAutoBinding(
        design,
        layout,
        compatiblePropertyTypes,
      );

      // The element stays unbound when every compatible property is
      // already taken
      if (property) {
        api.updateDesignElement(id, { property });
      }
    },

    moveDesignElement: (id, newParentId, index) => {
      // Free-form content can't be dropped into the panel row itself
      if (newParentId === 'root' && isActiveRootPanelled()) {
        return;
      }

      // Moving a container inside itself would detach it and its
      // subtree from the layout
      if (newParentId === id || isDescendantOf(newParentId, id)) {
        return;
      }

      commitHistory();

      api.moveElement(id, newParentId, index);
      selectDroppedElement(id);
      api.scheduleSave();
    },

    sortDesignElement: (elementId, targetIndex) => {
      commitHistory();

      api.sortElement(elementId, targetIndex);
      selectDroppedElement(elementId);
      api.scheduleSave();
    },

    addDesignElementFromTemplate: (template, parentId, index, layoutId) => {
      // New elements can't be dropped into the panel row itself
      if (parentId === 'root' && isActiveRootPanelled()) {
        return;
      }

      const element = {
        ...template,
        id: uuid(),
        parent: parentId,
      } as FlatDesignElement;

      const config = getElementConfig(element.type);

      // Without property binding, content elements start in static
      // mode so they are immediately editable. Element types which
      // are always property bound are left alone.
      if (!api.isPropertyBindingEnabled() && config.supportsStaticContent) {
        element.static = true;
      } else {
        // Bind the element to a compatible property, so an element
        // dropped into a design that has an obvious match for it
        // arrives ready to render
        bindElementToProperty(
          element,
          getElementCompatiblePropertyTypes(element),
          layoutId,
        );
      }

      commitHistory();

      api.addElement(element, parentId, index, layoutId);
      selectDroppedElement(element.id, layoutId);
      api.scheduleSave();
    },

    deleteHighlightedElement: (options = {}) => {
      const highlightedElementId = api.getHighlightedElementId();

      // Nothing highlighted to delete
      if (!highlightedElementId) {
        return;
      }

      // Deleting the root deletes the entire layout, when allowed
      if (highlightedElementId === 'root') {
        const activeLayoutId = api.getActiveLayoutId();

        if (options.allowRootDelete && activeLayoutId) {
          api.removeLayout(activeLayoutId);
        }

        return;
      }

      const element = api.getDesignElement(highlightedElementId);

      // The content region of a panelled root cannot be deleted
      if (
        element?.type === 'container' &&
        'role' in element &&
        element.role === 'page-content'
      ) {
        return;
      }

      // Deleting a panel disables it, discarding its contents
      if (element?.type === 'page-panel') {
        api.removePagePanel(element.side);

        return;
      }

      // Remove the element and persist
      commitHistory();

      api.removeElement(highlightedElementId);
      api.selectElement(null);
      api.scheduleSave();
    },

    addPagePanel: (side) => {
      applyPagePanelTransform((root) => enablePagePanel(root, side));
    },

    removePagePanel: (side) => {
      applyPagePanelTransform((root) => disablePagePanel(root, side));
    },

    updateElementStyle: (id, key, value) => {
      const element = api.getDesignElement(id);

      if (!element) {
        return;
      }

      // Clicking through one control's options is a single undo step
      commitHistory(`${id}:${key}`);

      const style = { ...element.style } as Record<string, unknown>;

      // Unset the key when no value is given, since an omitted key
      // means no CSS is emitted
      if (value === undefined) {
        delete style[key];
      } else {
        style[key] = value;
      }

      api.replaceElement(id, { ...element, style } as FlatDesignElement);
      api.clearHighlight();
      api.scheduleSave();
    },
  };

  /**
   * Cancels the pending debounced save, if any.
   */
  function cancelScheduledSave(): void {
    if (saveTimer === null) {
      return;
    }

    clearTimeout(saveTimer);
    saveTimer = null;
  }

  /**
   * Queues a write of the current design behind any in-flight one.
   * The layouts are rebuilt at queue time rather than write time, so
   * a write always persists the state that triggered it and queued
   * writes land in the order they were made.
   */
  function enqueueSave(): Promise<void> {
    const { design, elementsByLayout, saveHandler } = store.getState();

    // Nothing to persist before a design is open
    if (!design) {
      return saveChain;
    }

    // Rebuild each layout's tree from its element bucket
    const layouts = design.layouts.map((layout) => {
      const elements = elementsByLayout[layout.id];

      if (!elements) {
        return layout;
      }

      return { ...layout, tree: reconstructTree(elements) };
    });

    const write = saveChain.then(() =>
      writeLayouts(design, layouts, saveHandler),
    );

    // Keep the chain usable after a failed write so later saves
    // still run, while the caller still sees the failure
    saveChain = write.catch(() => undefined);

    return write;
  }

  /**
   * Writes the rebuilt layouts through the save handler when one is
   * set, or to the designs store otherwise.
   */
  async function writeLayouts(
    design: Design,
    layouts: Layout[],
    saveHandler: DesignStudioState['saveHandler'],
  ): Promise<void> {
    // Delegate persistence to the save handler when editing a
    // standalone layout
    if (saveHandler) {
      await saveHandler(layouts);

      syncSavedDesign({ ...design, layouts, lastModified: new Date() });

      return;
    }

    const updated = await Designs.update(design.id, { layouts });

    syncSavedDesign(updated);
  }

  /**
   * Refreshes the design snapshot after a write, unless the studio
   * has since moved on to another design or been cleared, in which
   * case the write's result is stale.
   */
  function syncSavedDesign(design: Design): void {
    if (store.getState().design?.id !== design.id) {
      return;
    }

    api.setDesign(design);
  }

  /**
   * Records the current content as an undo step and clears the redo
   * stack, unless the edit continues the previous step.
   *
   * @param coalesceKey - Identifies the edit target. Repeated edits
   *   to the same target within the coalesce window extend the
   *   existing step instead of adding one. Omit for structural edits,
   *   which always get their own step.
   */
  function commitHistory(coalesceKey?: string): void {
    const state = store.getState();
    const snapshot = captureSnapshot(state);

    // Nothing to snapshot before a design is open
    if (!snapshot) {
      return;
    }

    const now = Date.now();

    // The step already taken covers this edit, since it snapshots
    // the content from before the run of edits began
    if (
      coalesceKey !== undefined &&
      coalesceKey === lastCoalesceKey &&
      now - lastCommitTime < HISTORY_COALESCE_WINDOW_MS
    ) {
      lastCommitTime = now;

      return;
    }

    lastCoalesceKey = coalesceKey ?? null;
    lastCommitTime = now;

    set({
      // Cap the history, dropping the oldest step
      undoStack: [...state.undoStack, snapshot].slice(-UNDO_STACK_LIMIT),
      redoStack: [],
    });
  }

  /**
   * Captures the design content as a history snapshot, or null when
   * no design is open.
   */
  function captureSnapshot(
    state: DesignStudioState,
  ): DesignStudioSnapshot | null {
    if (!state.design) {
      return null;
    }

    return {
      layouts: state.design.layouts,
      elementsByLayout: state.elementsByLayout,
    };
  }

  /**
   * Restores a history snapshot along with the new history stacks,
   * then persists the restored content.
   */
  function restoreSnapshot(
    snapshot: DesignStudioSnapshot,
    stacks: Pick<DesignStudioState, 'undoStack' | 'redoStack'>,
  ): void {
    const state = store.getState();

    if (!state.design) {
      return;
    }

    // Restore the layouts onto the open design, leaving the fields
    // history does not track (name, properties) as they are
    const design = { ...state.design, layouts: snapshot.layouts };

    // Keep editing the active layout when it survived the restore
    const activeLayoutId =
      state.activeLayoutId && snapshot.elementsByLayout[state.activeLayoutId]
        ? state.activeLayoutId
        : null;

    set({
      ...stacks,
      design,
      elementsByLayout: snapshot.elementsByLayout,
      activeLayoutId,
      selectedElementId: resolveRestoredSelection(
        state,
        snapshot,
        activeLayoutId,
      ),
      // The highlighted element may no longer exist
      highlightedElementId: null,
      fadingHighlightElementId: null,
    });

    // The restored content still has to reach disk
    api.scheduleSave();

    // The next edit starts its own history step
    lastCoalesceKey = null;
  }

  /**
   * Resolves the selection to keep after a restore: the selected
   * element when it survived, otherwise the active layout's root.
   */
  function resolveRestoredSelection(
    state: DesignStudioState,
    snapshot: DesignStudioSnapshot,
    activeLayoutId: string | null,
  ): string | null {
    // Nothing is selected without an active layout
    if (!activeLayoutId) {
      return null;
    }

    const elements = snapshot.elementsByLayout[activeLayoutId];

    // Keep the selection when the element survived the restore
    if (state.selectedElementId && elements?.[state.selectedElementId]) {
      return state.selectedElementId;
    }

    return 'root';
  }

  /**
   * Applies a page-root tree transform to the active layout by
   * reconstructing its tree, transforming it, and re-flattening the
   * result back into the store.
   */
  function applyPagePanelTransform(
    transform: (root: RootElement) => RootElement,
  ): void {
    const layoutId = api.getActiveLayoutId();

    if (!layoutId) {
      return;
    }

    const elements = api.getElementsByLayout()[layoutId];

    if (!elements) {
      return;
    }

    // Rebuild the tree, transform it, and re-flatten the result
    const root = reconstructTree(elements);

    commitHistory();

    api.replaceLayoutElements(layoutId, flattenTree(transform(root)));
    api.selectElement('root', layoutId);
    api.scheduleSave();
  }

  /**
   * Whether an element sits somewhere below an ancestor element in
   * the same layout.
   */
  function isDescendantOf(elementId: string, ancestorId: string): boolean {
    const layoutId = findElementLayoutId(store.getState(), elementId);

    if (!layoutId) {
      return false;
    }

    const elements = api.getElements(layoutId);

    // Walk up the parent chain, stopping at the root
    let current = elements[elementId];

    while (current && 'parent' in current) {
      if (current.parent === ancestorId) {
        return true;
      }

      current = elements[current.parent];
    }

    return false;
  }

  /**
   * Whether the active layout's root is panelled. Used to reject
   * dropping free-form content directly into the panel row.
   */
  function isActiveRootPanelled(): boolean {
    const layoutId = api.getActiveLayoutId();

    if (!layoutId) {
      return false;
    }

    const elements = api.getElements(layoutId);
    const root = elements['root'];

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

      return (
        child.type === 'container' &&
        'role' in child &&
        child.role === 'page-content'
      );
    });
  }

  /**
   * Selects a dropped element and activates its layout.
   */
  function selectDroppedElement(elementId: string, layoutId?: string): void {
    const resolvedLayoutId =
      layoutId ?? findElementLayoutId(store.getState(), elementId) ?? undefined;

    api.selectElement(elementId, resolvedLayoutId);
  }

  /**
   * Binds an element to the first compatible design property left
   * unbound in its layout, leaving it unbound when none qualifies.
   */
  function bindElementToProperty(
    element: FlatDesignElement,
    compatiblePropertyTypes: readonly PropertyType[],
    layoutId?: string,
  ): void {
    // Element types which render no property have nothing to bind
    if (compatiblePropertyTypes.length === 0) {
      return;
    }

    // Containers bind an image as their background, which is a
    // styling choice made deliberately from the panel. Claiming a
    // property automatically would quietly consume it.
    if ('children' in element) {
      return;
    }

    const design = api.getDesign();

    // Bindings are resolved against the open design's properties
    if (!design) {
      return;
    }

    // Resolve against the live layout, since a property bound by an
    // edit made since the last save is still taken
    const layout = api.getLiveLayout(layoutId);

    if (!layout) {
      return;
    }

    const property = resolveAutoBinding(
      design,
      layout,
      compatiblePropertyTypes,
    );

    if (property) {
      element.property = property;
    }
  }

  return api;
}

/**
 * Returns the element map of the active layout, or an empty map
 * when no layout is active.
 */
export function getActiveElements(
  state: DesignStudioState,
): Record<string, FlatDesignElement> {
  if (!state.activeLayoutId) {
    return EMPTY_ELEMENTS;
  }

  return state.elementsByLayout[state.activeLayoutId] || EMPTY_ELEMENTS;
}

/**
 * Returns the element map of the given layout when an ID is
 * provided, falling back to the active layout's elements.
 */
export function getScopedElements(
  state: DesignStudioState,
  layoutId: string | null,
): Record<string, FlatDesignElement> {
  if (!layoutId) {
    return getActiveElements(state);
  }

  return state.elementsByLayout[layoutId] || EMPTY_ELEMENTS;
}

/**
 * Returns the layout currently being edited, or null when no
 * layout is active.
 */
export function getActiveLayout(state: DesignStudioState): Layout | null {
  if (!state.design || !state.activeLayoutId) {
    return null;
  }

  return (
    state.design.layouts.find((layout) => layout.id === state.activeLayoutId) ||
    null
  );
}

/**
 * The store's initial (and cleared) state.
 */
function initialState(): DesignStudioState {
  return {
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
    mediaDirPath: null,
    undoStack: [],
    redoStack: [],
  };
}

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
 * Finds the ID of the layout whose element map contains the given
 * element, preferring the active layout's bucket since root element
 * IDs are shared between layouts.
 */
function findElementLayoutId(
  state: DesignStudioState,
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
