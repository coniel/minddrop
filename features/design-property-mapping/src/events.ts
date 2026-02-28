export const EventListenerId = 'feature-design-property-mapping';

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
