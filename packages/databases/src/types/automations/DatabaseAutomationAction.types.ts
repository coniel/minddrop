export type DatabaseAutomationActionPropertyMapping = Record<string, string>;

export interface DatabaseAutomationAction<
  TPropertyMapping extends
    DatabaseAutomationActionPropertyMapping = DatabaseAutomationActionPropertyMapping,
> {
  type: string;
  propertyMapping?: TPropertyMapping;
}
