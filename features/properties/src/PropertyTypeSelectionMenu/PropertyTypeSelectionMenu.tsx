import { ReactElement } from 'react';
import {
  Properties,
  PropertySchema,
  PropertySchemaTemplate,
} from '@minddrop/properties';
import {
  DropdownMenu,
  DropdownMenuProps,
  DropdownMenuSeparator,
  DropdownSearchableMenuItem,
  MenuGroup,
} from '@minddrop/ui-primitives';

export interface PropertyTypeSelectionMenuProps
  extends Omit<DropdownMenuProps, 'children' | 'trigger'> {
  /**
   * The trigger element for the menu.
   */
  children?: ReactElement;

  /**
   * Callback fired when a property type is selected.
   */
  onSelect: (property: PropertySchemaTemplate) => void;

  /**
   * An array of existing property types against which to check
   * for single instance properties to omit from the menu.
   */
  existingProperties?: PropertySchema[];
}

export const PropertyTypeSelectionMenu: React.FC<
  PropertyTypeSelectionMenuProps
> = ({ children, onSelect, existingProperties = [], ...other }) => {
  // Singleton types the schema already contains, omitted from the menu
  const existingSingletonTypes = existingProperties
    .filter((property) => Properties.schemas[property.type]?.singleton)
    .map((property) => property.type);
  const availableProperties = Object.values(Properties.schemas).filter(
    (schema) => !existingSingletonTypes.includes(schema.type),
  );
  // The single instance properties every entry can carry, metadata
  // first and the content document below them.
  const singletonProperties = [
    ...availableProperties.filter((property) => property.meta),
    ...availableProperties.filter(
      (property) => property.singleton && !property.meta,
    ),
  ];
  const basicProperties = availableProperties.filter(
    (property) => !property.meta && !property.singleton,
  );

  return (
    <DropdownMenu
      trigger={children!}
      minWidth={300}
      contentClassName="property-type-selection-menu"
      searchable
      {...other}
    >
      {/** Single instance property types **/}
      <MenuGroup>
        {singletonProperties.map((schema) => (
          <DropdownSearchableMenuItem
            key={schema.type}
            label={schema.name}
            contentIcon={schema.icon}
            tooltip={{ description: schema.description }}
            onSelect={() => onSelect(schema)}
          />
        ))}
      </MenuGroup>

      {singletonProperties.length > 0 && <DropdownMenuSeparator />}

      {/** Basic property types **/}
      <MenuGroup>
        {basicProperties.map((schema) => (
          <DropdownSearchableMenuItem
            key={schema.type}
            label={schema.name}
            contentIcon={schema.icon}
            tooltip={{ description: schema.description }}
            onSelect={() => onSelect(schema)}
          />
        ))}
      </MenuGroup>
    </DropdownMenu>
  );
};
