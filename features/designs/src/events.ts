import { LayoutType } from '@minddrop/designs';

// -- View names --

export const DesignStudioViewName = 'designs:view:studio';
export const LayoutBrowserViewName = 'designs:view:browser';

// -- Design Studio events --

export const DesignStudioEventListenerId = 'feature-design-studio';
export const OpenDesignStudioEvent = 'design-studio:open';

export interface OpenDesignStudioEventData {
  /**
   * The label to display on the back button.
   */
  backButtonLabel?: string;

  /**
   * The event to dispatch when the back button is pressed.
   */
  backEvent?: string;

  /**
   * The data to pass to the back event.
   */
  backEventData?: any;

  /**
   * When set, a new layout of this type is created and
   * opened automatically with the left panel set to
   * the elements tab.
   */
  newLayoutType?: LayoutType;
}

// -- Layout Property Mapping events --

export const LayoutPropertyMappingEventListenerId =
  'feature-layout-property-mapping';

// Opens the layout browser overlay for a database
export const BrowseLayoutsEvent =
  'feature-layout-property-mapping:layouts:browse';

// Opens the property mapper overlay for a database + layout
export const OpenPropertyMapperEvent =
  'feature-layout-property-mapping:mapper:open';

export interface BrowseLayoutsEventData {
  /**
   * The ID of the database to browse layouts for.
   */
  databaseId: string;
}

export interface OpenPropertyMapperEventData {
  /**
   * The ID of the database to map properties from.
   */
  databaseId: string;

  /**
   * The ID of the layout to map properties to.
   */
  layoutId: string;
}
