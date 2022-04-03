import {
  RichTextElement,
  RichTextElementMap,
  UpdateRichTextElementData,
} from '@minddrop/rich-text';
import createStore from 'zustand';

export interface RichTextEditorStore {
  /**
   * An `{ [id]: RichTextElement }` map of created rich
   * text elements.
   */
  createdElements: RichTextElementMap;

  /**
   * The IDs of created elements in the order in which
   * they were created.
   */
  creationOrder: string[];

  /**
   * An `{ [id]: UpdateRichTextElementData }` map of updates
   * to rich text elements.
   */
  updatedElements: Record<string, UpdateRichTextElementData>;

  /**
   * An array of deleted rich text element IDs.
   */
  deletedElements: string[];

  /**
   * The document's children. Empty if no changes have been
   * made to them.
   */
  documentChildren: string[];

  /**
   * Adds a created element to the store.
   *
   * @param element The created element.
   */
  addCreatedElement(element: RichTextElement): void;

  /**
   * Removes a created element from the store.
   *
   * @param id The ID of the element to remove.
   */
  removeCreatedElement(id: string): void;

  /**
   * Adds the update data of an updated element to the store.
   *
   * @param id The ID of the updated element.
   * @param data The update data.
   */
  addUpdatedElement(id: string, data: UpdateRichTextElementData): void;

  /**
   * Removes the update data of an updated element from the store.
   *
   * @param id The ID of the element to remove.
   */
  removeUpdatedElement(id: string): void;

  /**
   * Adds the ID of a deleted element to the store.
   *
   * @param id The ID of the deleted element.
   */
  addDeletedElement(id: string): void;

  /**
   * Removes the ID of a deleted element from the store.
   *
   * @param id The ID of the element to remove.
   */
  removeDeletedElement(id: string): void;

  /**
   * Sets the document's children in the store.
   *
   * @param children The document's children.
   */
  setDocumentChildren(children: string[]): void;

  /**
   * Clears all data from the store.
   */
  clear(): void;
}

export const useRichTextEditorStore = createStore<RichTextEditorStore>(
  (set) => ({
    createdElements: {},
    creationOrder: [],
    updatedElements: {},
    deletedElements: [],
    documentChildren: [],

    addCreatedElement: (element) =>
      set((state) => ({
        createdElements: { ...state.createdElements, [element.id]: element },
        creationOrder: [...state.creationOrder, element.id],
      })),

    removeCreatedElement: (id) =>
      set((state) => {
        // Clone created elements
        const createdElements = { ...state.createdElements };

        // Remove the element
        delete createdElements[id];

        // Return state the element removed from `createdElements` and
        // the element ID removed from `creationOrder`.
        return {
          createdElements,
          creationOrder: state.creationOrder.filter(
            (elementId) => elementId !== id,
          ),
        };
      }),

    addUpdatedElement: (id, data) =>
      set((state) => ({
        updatedElements: { ...state.updatedElements, [id]: data },
      })),

    removeUpdatedElement: (id) =>
      set((state) => {
        // Clone updated elements
        const updatedElements = { ...state.updatedElements };

        // Remove the element update data
        delete updatedElements[id];

        // Return `updatedElements` with the data removed
        return { updatedElements };
      }),

    addDeletedElement: (id) =>
      set((state) => ({ deletedElements: [...state.deletedElements, id] })),

    removeDeletedElement: (id) =>
      set((state) => ({
        deletedElements: state.deletedElements.filter(
          (elementId) => elementId !== id,
        ),
      })),

    setDocumentChildren: (children) =>
      set(() => ({ documentChildren: children })),

    clear: () =>
      set({
        createdElements: {},
        creationOrder: [],
        updatedElements: {},
        deletedElements: [],
        documentChildren: [],
      }),
  }),
);
