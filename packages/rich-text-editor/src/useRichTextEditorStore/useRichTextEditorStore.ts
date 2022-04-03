import {
  RichTextElement,
  RichTextElementMap,
  UpdateRichTextElementData,
} from '@minddrop/rich-text';
import { generateId } from '@minddrop/utils';
import createStore from 'zustand';

export interface RichTextEditorStore {
  /**
   * A UUID changed every time store data (except
   * `documentRevisions`) is modified.
   * Allows the store to be watched for changes without
   * needing to do deep comparisons of the data.
   */
  storeRevision: string;

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
   * The document revisions created during this editing session.
   */
  documentRevisions: string[];

  /**
   * The document's children. Empty if no changes have been
   * made to them.
   */
  documentChildren: string[];

  /**
   * Adds a new document revision ID to the store.
   *
   * @param revision The revision ID.
   */
  addDocumentRevision(revision: string): void;

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
   * Clears the revisions.
   */
  clearDocumentRevisions(): void;

  /**
   * Clears all data apart except revisions from the store.
   */
  clear(): void;
}

export const useRichTextEditorStore = createStore<RichTextEditorStore>(
  (set) => ({
    storeRevision: generateId(),
    createdElements: {},
    creationOrder: [],
    updatedElements: {},
    deletedElements: [],
    documentRevisions: [],
    documentChildren: [],

    addCreatedElement: (element) =>
      set((state) => ({
        // Set a new store revision ID
        storeRevision: generateId(),
        // Add the element to `createdElements`
        createdElements: { ...state.createdElements, [element.id]: element },
        // Add the element ID to the end of `creationOrder`
        creationOrder: [...state.creationOrder, element.id],
      })),

    removeCreatedElement: (id) =>
      set((state) => {
        // Clone created elements
        const createdElements = { ...state.createdElements };

        // Remove the element
        delete createdElements[id];

        return {
          // Set a new store revision ID
          storeRevision: generateId(),
          // Set `createdElements` to the updated value
          createdElements,
          // Remove the element ID from `creationOrder`
          creationOrder: state.creationOrder.filter(
            (elementId) => elementId !== id,
          ),
        };
      }),

    addUpdatedElement: (id, data) =>
      set((state) => ({
        // Set a new store revision ID
        storeRevision: generateId(),
        // Add the updated element data to `updatedElements`
        updatedElements: { ...state.updatedElements, [id]: data },
      })),

    removeUpdatedElement: (id) =>
      set((state) => {
        // Clone updated elements
        const updatedElements = { ...state.updatedElements };

        // Remove the element update data
        delete updatedElements[id];

        return {
          // Set a new store revision ID
          storeRevision: generateId(),
          // Set `updatedElements` to the updated value
          updatedElements,
        };
      }),

    addDeletedElement: (id) =>
      set((state) => ({
        // Set a new store revision ID
        storeRevision: generateId(),
        // Add the element ID to `deletedElements`
        deletedElements: [...state.deletedElements, id],
      })),

    removeDeletedElement: (id) =>
      set((state) => ({
        // Set a new store revision ID
        storeRevision: generateId(),
        // Remove the element ID from `deletedElements`
        deletedElements: state.deletedElements.filter(
          (elementId) => elementId !== id,
        ),
      })),

    addDocumentRevision: (revision) =>
      set((state) => ({
        // Add the revision ID to `documentRevisions`
        documentRevisions: [...state.documentRevisions, revision],
      })),

    setDocumentChildren: (children) =>
      set(() => ({
        // Set a new store revision ID
        storeRevision: generateId(),
        // Set the child IDs as `documentChildren`
        documentChildren: children,
      })),

    clearDocumentRevisions: () =>
      set({
        // Set `documentRevisions` back to an empty array
        documentRevisions: [],
      }),

    clear: () =>
      set({
        // Set all non revision related data fields
        // back to empty values.
        createdElements: {},
        creationOrder: [],
        updatedElements: {},
        deletedElements: [],
        documentChildren: [],
      }),
  }),
);
