export interface DatabaseAutomationAction {
  /**
   * The action type. Should be unique across all actions.
   */
  type: string;

  /**
   * A map of value names to property names, determining how the action
   * sets properties on the database entry. Only applicable if the action
   * sets values on properties.
   */
  propertyMapping?: Record<string, string>;
}
