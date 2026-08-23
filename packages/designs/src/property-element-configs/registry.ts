import type { PropertyType } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import type { PropertyElementConfig } from '../types';
import { DatePropertyElementConfig } from './date';
import { NumberPropertyElementConfig } from './number';
import { TextPropertyElementConfig } from './text';

/**
 * All built-in property element configs. The palette lists
 * property elements in this order.
 */
const propertyElementConfigs: PropertyElementConfig[] = [
  TextPropertyElementConfig,
  NumberPropertyElementConfig,
  DatePropertyElementConfig,
];

// Configs indexed by property type for constant time lookup
const propertyElementConfigMap: Partial<
  Record<PropertyType, PropertyElementConfig>
> = Object.fromEntries(
  propertyElementConfigs.map((config) => [config.propertyType, config]),
);

/**
 * Returns every property element config.
 */
export function getPropertyElementConfigs(): PropertyElementConfig[] {
  return propertyElementConfigs;
}

/**
 * Returns the property element config for the given property type.
 *
 * @param propertyType - The property type to look up.
 * @param throwOnNotFound - Whether to throw when the property type has no config. Defaults to true.
 * @returns The property element config, or null when not found and not throwing.
 *
 * @throws {InvalidParameterError} If the property type has no config and throwing is enabled.
 */
export function getPropertyElementConfig(
  propertyType: PropertyType,
  throwOnNotFound?: true,
): PropertyElementConfig;
export function getPropertyElementConfig(
  propertyType: PropertyType,
  throwOnNotFound: false,
): PropertyElementConfig | null;
export function getPropertyElementConfig(
  propertyType: PropertyType,
  throwOnNotFound = true,
): PropertyElementConfig | null {
  // Look up the config by property type
  const config = propertyElementConfigMap[propertyType];

  // Guard against property types without a config
  if (!config) {
    if (throwOnNotFound) {
      throw new InvalidParameterError(
        `No property element config registered for property type '${propertyType}'.`,
      );
    }

    return null;
  }

  return config;
}
