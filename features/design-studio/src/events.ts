export const EventListenerId = 'designs-feature';
export const OpenDatabaseDesignStudioEvent = 'design-studio:open:database';

export interface OpenDesignStudioEventData {
  /**
   * The variant of the design studio to open.
   */
  variant: 'database';

  /**
   * The ID of the database to which the design belongs.
   */
  databaseId?: string;

  /**
   * The ID of the design to edit.
   */
  designId?: string;
}

export interface OpenDatabaseDesignStudioEventData {
  /**
   * The ID of the database to which the design belongs.
   */
  databaseId: string;

  /**
   * The ID of the design to edit.
   */
  designId: string;
}
