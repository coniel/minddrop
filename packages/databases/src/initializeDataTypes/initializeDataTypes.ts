import { i18n } from '@minddrop/i18n';
import { coreDataTypes } from '../data-type-configs';
import { registerDataType } from '../registerDataType';
import { DatabaseAutomationAction, DatabaseAutomationTemplate } from '../types';

/**
 * Registers all core data types into the DataTypesStore.
 */
export function initializeDataTypes() {
  // Register core data types
  coreDataTypes.forEach((dataType) => {
    // Translate data type names and descriptions
    registerDataType({
      ...dataType,
      name: i18n.t(dataType.name),
      description: i18n.t(dataType.description),
      properties: dataType.properties.map((property) => {
        return {
          ...property,
          name: i18n.t(property.name),
          description: property.description
            ? i18n.t(property.description)
            : undefined,
        };
      }),
      automations: dataType.automations
        ? dataType.automations.map((automation): DatabaseAutomationTemplate => {
            return {
              ...automation,
              name: i18n.t(automation.name),
              description: automation.description
                ? i18n.t(automation.description)
                : undefined,
              property: automation.property
                ? i18n.t(automation.property)
                : undefined,
              actions: automation.actions.map(
                (action): DatabaseAutomationAction => {
                  return {
                    ...action,
                    propertyMapping: action.propertyMapping
                      ? Object.fromEntries(
                          Object.entries(action.propertyMapping).map(
                            ([key, value]) => [key, i18n.t(value as string)],
                          ),
                        )
                      : {},
                  };
                },
              ),
            };
          })
        : undefined,
    });
  });
}
