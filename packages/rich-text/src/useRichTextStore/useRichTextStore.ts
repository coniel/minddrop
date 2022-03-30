import createStore from 'zustand';
import { RichTextStore } from '../types';

export const useRichTextStore = createStore<RichTextStore>((set) => ({
  documents: {},
  elements: {},
  elementConfigs: {},

  loadDocuments: (documents) =>
    set((state) => ({
      documents: {
        ...state.documents,
        ...documents.reduce(
          (map, document) => ({
            ...map,
            [document.id]: document,
          }),
          {},
        ),
      },
    })),

  setDocument: (document) =>
    set((state) => ({
      documents: { ...state.documents, [document.id]: document },
    })),

  removeDocument: (id) =>
    set((state) => {
      const documents = { ...state.documents };
      delete documents[id];
      return { documents };
    }),

  loadElements: (elements) =>
    set((state) => ({
      elements: {
        ...state.elements,
        ...elements.reduce(
          (map, element) => ({
            ...map,
            [element.id]: element,
          }),
          {},
        ),
      },
    })),

  setElement: (element) =>
    set((state) => ({
      elements: {
        ...state.elements,
        [element.id]: element,
      },
    })),

  removeElement: (id) =>
    set((state) => {
      const elements = { ...state.elements };
      delete elements[id];
      return { elements };
    }),

  setElementConfig: (config) =>
    set((state) => ({
      elementConfigs: {
        ...state.elementConfigs,
        [config.type]: config,
      },
    })),

  removeElementConfig: (type) =>
    set((state) => {
      const elementConfigs = { ...state.elementConfigs };
      delete elementConfigs[type];
      return { elementConfigs };
    }),

  clear: () => set(() => ({ documents: {}, elements: {}, elementConfigs: {} })),
}));