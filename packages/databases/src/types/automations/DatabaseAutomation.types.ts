import { PropertyType } from '@minddrop/properties';
import { DatabaseAutomationAction } from './actions';

export type DatabaseAutomationTrigger =
  | 'create-entry'
  | 'delete-entry'
  | 'update-property';

export interface PropertySetterConfig {
  name: string;
  description?: string;
  supportedPropertyTypes: PropertyType[];
}

export interface DatabaseAutomation {
  /**
   * A unique identifier for the automation.
   */
  id: string;

  /**
   * The name of the automation.
   */
  name: string;

  /**
   * The automation description.
   */
  description?: string;

  /**
   * The automation trigger type;
   */
  type: DatabaseAutomationTrigger;

  /**
   * The ID of the database which triggers the automation.
   */
  database: string;

  /**
   * The property which triggers the automation. Only applicable to property
   * based triggers.
   */
  property?: string;

  /**
   * The actions to perform when the automation is triggered.
   */
  actions: DatabaseAutomationAction[];
}

export type DatabaseAutomationTemplate = Omit<
  DatabaseAutomation,
  'id' | 'database'
>;
