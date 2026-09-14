import React from 'react';
import { PropertiesSchema, PropertySchema } from '@minddrop/properties';
import { SearchableMenuItem } from '@minddrop/ui-primitives';

export interface PropertyMenuItemsProps {
  /**
   * The properties to pick from.
   */
  properties: PropertiesSchema;

  /**
   * Callback fired with the picked property.
   */
  onSelect(property: PropertySchema): void;
}

/**
 * Renders properties as searchable menu items.
 */
export const PropertyMenuItems: React.FC<PropertyMenuItemsProps> = ({
  properties,
  onSelect,
}) => (
  <>
    {properties.map((property) => (
      <SearchableMenuItem
        key={property.name}
        stringLabel={property.name}
        contentIcon={property.icon}
        onSelect={() => onSelect(property)}
      />
    ))}
  </>
);
