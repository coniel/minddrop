import { useCallback, useMemo, useState } from 'react';
import { Databases } from '@minddrop/databases';
import { DesignElementType } from '@minddrop/designs';
import { PropertySchema } from '@minddrop/properties';
import { useDraggable } from '@minddrop/selection';
import {
  ContentIcon,
  Icon,
  IconButton,
  MenuLabel,
  ScrollArea,
  TextInput,
} from '@minddrop/ui-primitives';
import { useDesignPropertyMappingStore } from '../DesignPropertyMappingStore';
import {
  DatabasePropertiesDataKey,
  PropertyTypeElementMap,
} from '../constants';

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
  { key: 'url', label: 'design-studio.elements.url' },
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
  const propertyMap = useDesignPropertyMappingStore(
    (state) => state.propertyMap,
  );
  const setHoveredPropertyName = useDesignPropertyMappingStore(
    (state) => state.setHoveredPropertyName,
  );

  // Set of property names that are already mapped to design elements
  const mappedPropertyNames = useMemo(
    () => new Set(Object.values(propertyMap)),
    [propertyMap],
  );
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
        // Use the first (primary) element type for grouping
        const elementType = PropertyTypeElementMap[property.type][0];

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
        <div className="property-list">
          {ElementGroups.map(({ key, label }) => {
            const properties = groupedProperties[key];

            if (!properties?.length) {
              return null;
            }

            return (
              <div key={key} className="property-group">
                <MenuLabel label={label} />
                <div className="property-group-items">
                  {properties.map((property) => (
                    <DraggablePropertyItem
                      key={property.name}
                      property={property}
                      mapped={mappedPropertyNames.has(property.name)}
                      onHover={setHoveredPropertyName}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

/******************************************************************************
 * DraggablePropertyItem
 *****************************************************************************/

interface DraggablePropertyItemProps {
  /**
   * The property schema to render as a draggable item.
   */
  property: PropertySchema;

  /**
   * Whether this property is already mapped to a design element.
   */
  mapped: boolean;

  /**
   * Callback to set/clear the hovered property name.
   */
  onHover: (name: string | null) => void;
}

/**
 * A draggable property chip that can be dropped onto design elements.
 * Shows a check icon and muted styling when already mapped.
 */
const DraggablePropertyItem: React.FC<DraggablePropertyItemProps> = ({
  property,
  mapped,
  onHover,
}) => {
  const { draggableProps } = useDraggable({
    id: property.name,
    type: DatabasePropertiesDataKey,
    data: property,
  });

  // Hover handlers for mapped items to trigger the connection line
  const handleMouseEnter = useCallback(() => {
    if (mapped) {
      onHover(property.name);
    }
  }, [mapped, onHover, property.name]);

  const handleMouseLeave = useCallback(() => {
    if (mapped) {
      onHover(null);
    }
  }, [mapped, onHover]);

  return (
    <div
      className={`draggable-property-item${mapped ? ' mapped' : ''}`}
      data-property-name={property.name}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...draggableProps}
    >
      {/* Drag handle */}
      <Icon
        name="grip-vertical"
        color="muted"
        className="property-item-handle"
      />

      {/* Property icon */}
      {property.icon && (
        <ContentIcon icon={property.icon} className="property-item-icon" />
      )}

      {/* Property name */}
      <span className="property-item-name">{property.name}</span>

      {/* Mapped indicator */}
      {mapped && <Icon name="check" className="property-item-check" />}
    </div>
  );
};
