import createStore from 'zustand';
import { RichTextStore } from '../types';

export const useRichTextStore = createStore<RichTextStore>((set) => ({
  documents: {},
  elements: {},
  elementConfigs: {},
  registrationOrder: [],

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

  clearDocuments: () => set({ documents: {} }),

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

  clearElements: () => set({ elements: {} }),

  setElementConfig: (config) =>
    set((state) => ({
      elementConfigs: {
        ...state.elementConfigs,
        [config.type]: config,
      },
      registrationOrder: [...state.registrationOrder, config.type],
    })),

  removeElementConfig: (type) =>
    set((state) => {
      const elementConfigs = { ...state.elementConfigs };
      delete elementConfigs[type];
      return {
        elementConfigs,
        registrationOrder: state.registrationOrder.filter((t) => t !== type),
      };
    }),

  clearElementConfigs: () => set({ elementConfigs: {}, registrationOrder: [] }),

  clear: () =>
    set(() => ({
      documents: {},
      elements: {},
      elementConfigs: {},
      registrationOrder: [],
    })),
}));
