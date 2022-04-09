export interface Resource {
  /**
   * The resource document's ID.
   */
  id: string;

  /**
   * The resource document's revision. Changed every
   * time the resource is updated in the database.
   */
  revision: string;
}
