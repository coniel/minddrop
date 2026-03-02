import { DesignType } from '@minddrop/designs';

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
   * When set, a new design of this type is created and
   * opened automatically with the left panel set to
   * the elements tab.
   */
  newDesignType?: DesignType;
}

// -- Design Property Mapping events --

export const DesignPropertyMappingEventListenerId =
  'feature-design-property-mapping';

// Opens the design browser overlay for a database
export const BrowseDesignsEvent =
  'feature-design-property-mapping:designs:browse';

// Opens the property mapper overlay for a database + design
export const OpenPropertyMapperEvent =
  'feature-design-property-mapping:mapper:open';

export interface BrowseDesignsEventData {
  /**
   * The ID of the database to browse designs for.
   */
  databaseId: string;
}

export interface OpenPropertyMapperEventData {
  /**
   * The ID of the database to map properties from.
   */
  databaseId: string;

  /**
   * The ID of the design to map properties to.
   */
  designId: string;
}
