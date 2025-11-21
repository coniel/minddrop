import { PropertyType, PropertyValue } from '@minddrop/properties';
import {
  DatabaseAutomationTrigger,
  PropertySetterConfig,
} from './DatabaseAutomation.types';
import { DatabaseAutomationAction } from './DatabaseAutomationAction.types';
import { DatabaseEntry } from './DatabaseEntry.types';

export interface DatabaseAutomationActionConfig {
  /**
   * A unique identifier for the action.
   */
  type: string;

  /**
   * The name of the action. Displayed in the UI.
   */
  name: string;

  /**
   * A description of the action. Displayed in the UI.
   */
  description: string;

  /**
   * The callback to execute when the action is triggered.
   *
   * @param entry - The entry the action was triggered on.
   */
  run: (
    action: DatabaseAutomationAction,
    entry: DatabaseEntry,
  ) => void | Promise<void>;

  /**
   * The types of triggers supported by the action.
   */
  supportedTriggers: DatabaseAutomationTrigger[];

  /**
   * The property types on which this action can be triggered.
   * Only applicable to property based triggers.
   */
  supportedTriggerPropertyTypes?: PropertyType[];

  /**
   * A map of value names to supported property types. Only applicable if
   * the action sets values on properties.
   */
  propertySetters?: PropertySetterConfig[];
}

/**
 * Defines a database automation action.
 */
export interface DatabaseAutomationUpdatePropertyActionConfig
  extends Omit<DatabaseAutomationActionConfig, 'supportedTriggers' | 'run'> {
  /**
   * The types of triggers supported by the action.
   */
  supportedTriggers: ['update-property'];

  /**
   * The callback to execute when the action is triggered.
   *
   * @param entry - The entry the action was triggered on.
   * @param originalPropertyValue - The original value of the updated property.
   * @param updatedPropertyValue - The updated value of the updated property.
   */
  run: (
    action: DatabaseAutomationAction,
    entry: DatabaseEntry,
    updatedPropertyValue: PropertyValue,
    originalPropertyValue: PropertyValue,
  ) => void | Promise<void>;
}
