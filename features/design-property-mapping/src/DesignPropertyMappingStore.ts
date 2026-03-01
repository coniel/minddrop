import { Databases, DesignPropertyMap } from '@minddrop/databases';
import { createStore } from '@minddrop/utils';

export interface DesignPropertyMappingStore {
  /**
   * The ID of the database being configured.
   */
  databaseId: string | null;

  /**
   * The ID of the currently selected design.
   */
  designId: string | null;

  /**
   * The current view in the design browser.
   */
  view: 'browse' | 'map-properties';

  /**
   * The in-progress property map: [elementId] -> propertyName.
   */
  propertyMap: DesignPropertyMap;

  /**
   * Sets the database ID and resets other state.
   */
  initialize: (databaseId: string) => void;

  /**
   * Selects a design and loads any existing property map
   * from the database configuration.
   */
  selectDesign: (designId: string) => void;

  /**
   * Sets the current view.
   */
  setView: (view: 'browse' | 'map-properties') => void;

  /**
   * Maps a property to a design element.
   */
  mapProperty: (elementId: string, propertyName: string) => void;

  /**
   * Removes a property mapping from a design element.
   */
  unmapProperty: (elementId: string) => void;

  /**
   * Resets all state.
   */
  clear: () => void;
}

export const DesignPropertyMappingStore =
  createStore<DesignPropertyMappingStore>((set, get) => ({
    databaseId: null,
    designId: null,
    view: 'browse',
    propertyMap: {},

    initialize: (databaseId) => {
      set({
        databaseId,
        designId: null,
        view: 'browse',
        propertyMap: {},
      });
    },

    selectDesign: (designId) => {
      const { databaseId } = get();

      // Load existing property map from the database if one exists
      let propertyMap: DesignPropertyMap = {};

      if (databaseId) {
        const database = Databases.get(databaseId);

        if (database?.designPropertyMaps?.[designId]) {
          propertyMap = { ...database.designPropertyMaps[designId] };
        }
      }

      set({ designId, propertyMap });
    },

    setView: (view) => {
      set({ view });
    },

    mapProperty: (elementId, propertyName) => {
      set((state) => ({
        propertyMap: { ...state.propertyMap, [elementId]: propertyName },
      }));
    },

    unmapProperty: (elementId) => {
      set((state) => {
        const { [elementId]: _, ...rest } = state.propertyMap;

        return { propertyMap: rest };
      });
    },

    clear: () => {
      set({
        databaseId: null,
        designId: null,
        view: 'browse',
        propertyMap: {},
      });
    },
  }));

export const useDesignPropertyMappingStore = DesignPropertyMappingStore;
