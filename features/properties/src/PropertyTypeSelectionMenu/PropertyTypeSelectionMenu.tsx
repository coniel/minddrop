import { ReactElement } from 'react';
import { PropertySchema, PropertySchemas } from '@minddrop/properties';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuProps,
  DropdownMenuSeparator,
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
  onSelect: (property: PropertySchema) => void;

  /**
   * An array of existing property types against which to check
   * for single instance properties to omit from the menu.
   */
  existingProperties?: PropertySchema[];
}

export const PropertyTypeSelectionMenu: React.FC<
  PropertyTypeSelectionMenuProps
> = ({ children, onSelect, existingProperties = [], ...other }) => {
  const existingMetaProperties = existingProperties
    .filter((property) => PropertySchemas[property.type]?.meta)
    .map((property) => property.type);
  const basicProperties = Object.values(PropertySchemas).filter(
    (property) => !property.meta,
  );
  const metaProperties = Object.values(PropertySchemas)
    .filter((property) => property.meta)
    .filter((schema) => !existingMetaProperties.includes(schema.type));

  return (
    <DropdownMenu
      trigger={children!}
      minWidth={300}
      contentClassName="property-type-selection-menu"
      {...other}
    >
      <MenuGroup padded>
        {basicProperties.map((schema) => (
          <DropdownMenuItem
            key={schema.type}
            label={schema.name}
            contentIcon={schema.icon}
            tooltipDescription={schema.description}
            onClick={() => onSelect(schema)}
          />
        ))}
      </MenuGroup>
      {metaProperties.length > 0 && <DropdownMenuSeparator />}
      <MenuGroup padded>
        {metaProperties.map((schema) => (
          <DropdownMenuItem
            key={schema.type}
            label={schema.name}
            contentIcon={schema.icon}
            tooltipTitle={schema.description}
            onClick={() => onSelect(schema)}
          />
        ))}
      </MenuGroup>
    </DropdownMenu>
  );
};
