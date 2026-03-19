import { Databases, DesignPropertyMap } from '@minddrop/databases';
import { PropertyType } from '@minddrop/properties';
import { createStore } from '@minddrop/stores';

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
   * The property type currently being dragged, or null if
   * no property drag is in progress.
   */
  draggingPropertyType: PropertyType | null;

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
   * Persists the current property map to the database.
   */
  savePropertyMap: () => void;

  /**
   * Sets the property type currently being dragged.
   */
  setDraggingPropertyType: (propertyType: PropertyType | null) => void;

  /**
   * The name of the property currently being hovered in the
   * property list, or null if none.
   */
  hoveredPropertyName: string | null;

  /**
   * Sets the hovered property name.
   */
  setHoveredPropertyName: (name: string | null) => void;

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
    draggingPropertyType: null,
    hoveredPropertyName: null,

    initialize: (databaseId) => {
      set({
        databaseId,
        designId: null,
        view: 'browse',
        propertyMap: {},
        hoveredPropertyName: null,
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
      // Remove any existing mapping for this property name so
      // a property is never mapped to multiple elements at once
      const currentMap = get().propertyMap;
      const previousElementId = Object.keys(currentMap).find(
        (key) => currentMap[key] === propertyName,
      );
      const { [previousElementId as string]: _, ...cleanedMap } = currentMap;

      const propertyMap = { ...cleanedMap, [elementId]: propertyName };

      // Update the store (persistence deferred to savePropertyMap)
      set({ propertyMap });
    },

    unmapProperty: (elementId) => {
      const { [elementId]: _, ...propertyMap } = get().propertyMap;

      // Update the store (persistence deferred to savePropertyMap)
      set({ propertyMap });
    },

    savePropertyMap: () => {
      const { databaseId, designId, propertyMap } = get();

      // Persist the property map to the database
      if (databaseId && designId) {
        Databases.setDesignPropertyMap(databaseId, designId, propertyMap);
      }
    },

    setDraggingPropertyType: (propertyType) => {
      set({ draggingPropertyType: propertyType });
    },

    setHoveredPropertyName: (name) => {
      set({ hoveredPropertyName: name });
    },

    clear: () => {
      set({
        databaseId: null,
        designId: null,
        view: 'browse',
        propertyMap: {},
        draggingPropertyType: null,
        hoveredPropertyName: null,
      });
    },
  }));

export const useDesignPropertyMappingStore = DesignPropertyMappingStore;
