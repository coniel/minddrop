import { useCallback, useMemo, useState } from 'react';
import { Databases } from '@minddrop/databases';
import { DesignElementType } from '@minddrop/designs';
import { PropertySchema, PropertyType } from '@minddrop/properties';
import {
  Icon,
  IconButton,
  MenuGroup,
  MenuItem,
  MenuLabel,
  ScrollArea,
  TextInput,
} from '@minddrop/ui-primitives';

/**
 * Maps each property type to the design element type that
 * renders it. Used to group properties by element support.
 */
const PropertyTypeElementMap: Record<PropertyType, DesignElementType | 'date'> =
  {
    title: 'text',
    text: 'text',
    'formatted-text': 'formatted-text',
    url: 'text',
    select: 'text',
    toggle: 'text',
    number: 'number',
    date: 'date',
    created: 'date',
    'last-modified': 'date',
    image: 'image',
    file: 'image',
    icon: 'icon',
  };

/**
 * Element groups in display order with their i18n label keys.
 */
const ElementGroups: {
  key: DesignElementType | 'date';
  label: string;
}[] = [
  { key: 'text', label: 'design-studio.elements.text' },
  { key: 'formatted-text', label: 'design-studio.elements.formatted-text' },
  { key: 'number', label: 'design-studio.elements.number' },
  { key: 'date', label: 'design-property-mapping.browser.dateGroup' },
  { key: 'image', label: 'design-studio.elements.image' },
  { key: 'icon', label: 'design-studio.elements.icon' },
];

export interface DatabasePropertyListProps {
  /**
   * The ID of the database whose properties to display.
   */
  databaseId: string;

  /**
   * Callback fired to navigate back to the design list.
   */
  onBack: () => void;
}

export const DatabasePropertyList: React.FC<DatabasePropertyListProps> = ({
  databaseId,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const database = Databases.use(databaseId);

  // Filter properties by search term
  const filteredProperties = useMemo(() => {
    if (!database) {
      return [];
    }

    if (!searchTerm) {
      return database.properties;
    }

    return database.properties.filter((property) =>
      property.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [database, searchTerm]);

  // Group filtered properties by their design element type
  const groupedProperties = useMemo(() => {
    return filteredProperties.reduce(
      (groups, property) => {
        const elementType = PropertyTypeElementMap[property.type];

        if (!groups[elementType]) {
          groups[elementType] = [];
        }

        groups[elementType].push(property);

        return groups;
      },
      {} as Record<string, PropertySchema[]>,
    );
  }, [filteredProperties]);

  if (!database) {
    return null;
  }

  return (
    <div className="design-browser-list">
      {/* Header with back button, search, and add property button */}
      <div className="design-browser-header">
        <IconButton
          icon="chevron-left"
          label="design-property-mapping.browser.backToDesigns"
          color="neutral"
          onClick={onBack}
        />
        <TextInput
          variant="subtle"
          size="md"
          placeholder="design-property-mapping.browser.searchProperties"
          leading={<Icon name="search" color="muted" />}
          value={searchTerm}
          onValueChange={setSearchTerm}
          clearable
        />
        <IconButton
          icon="plus"
          label="design-property-mapping.browser.addProperty"
          color="neutral"
        />
      </div>

      {/* Scrollable property list grouped by design element type */}
      <ScrollArea>
        <div className="design-browser-designs">
          {ElementGroups.map(({ key, label }) => {
            const properties = groupedProperties[key];

            if (!properties?.length) {
              return null;
            }

            return (
              <MenuGroup key={key}>
                <MenuLabel label={label} />
                {properties.map((property) => (
                  <MenuItem
                    key={property.name}
                    contentIcon={property.icon}
                    muted
                  >
                    {property.name}
                  </MenuItem>
                ))}
              </MenuGroup>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
