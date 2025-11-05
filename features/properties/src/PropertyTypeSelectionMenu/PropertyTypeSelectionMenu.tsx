import { PropertySchema, PropertySchemas } from '@minddrop/properties';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuProps,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuTriggerProps,
  MenuGroup,
} from '@minddrop/ui-primitives';

export interface PropertyTypeSelectionMenuProps
  extends Omit<DropdownMenuProps, 'children'> {
  /**
   * The content of the PropertyTypeSelectionMenu.
   */
  children?: DropdownMenuTriggerProps['render'];

  /**
   * Callback fired when a property type is selected.
   */
  onSelect: (property: PropertySchema) => void;

  /**
   * An array of property types to omit from the menu.
   */
  omitProperties?: string[];
}

export const PropertyTypeSelectionMenu: React.FC<
  PropertyTypeSelectionMenuProps
> = ({ children, onSelect, omitProperties = [], ...other }) => {
  const basicProperties = Object.values(PropertySchemas)
    .filter((property) => !property.meta)
    .filter((schema) => !omitProperties.includes(schema.type));
  const metaProperties = Object.values(PropertySchemas)
    .filter((property) => property.meta)
    .filter((schema) => !omitProperties.includes(schema.type));

  return (
    <DropdownMenu {...other}>
      <DropdownMenuTrigger render={children} />
      <DropdownMenuPortal>
        <DropdownMenuPositioner side="bottom" align="start">
          <DropdownMenuContent
            minWidth={300}
            className="property-type-selection-menu"
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
          </DropdownMenuContent>
        </DropdownMenuPositioner>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};
