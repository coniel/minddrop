import { useTranslation } from '@minddrop/i18n';
import {
  PropertiesSchema,
  PropertySchema,
  PropertyType,
} from '@minddrop/properties';
import {
  DropdownMenu,
  DropdownMenuSeparator,
  DropdownSearchableMenuItem,
  MenuGroup,
  MenuLabel,
  ToolbarIconButton,
} from '@minddrop/ui-primitives';
import { BlockControlOffset } from '../constants';

export interface DesignPropertyPickerProps {
  /**
   * The properties the element can be mapped to.
   */
  properties: PropertiesSchema;

  /**
   * The name of the picked property, or undefined when none is
   * picked.
   */
  value?: string;

  /**
   * The property types the element accepts. Properties of any other
   * type are left out of the menu.
   */
  types: PropertyType[];

  /**
   * The property types the element is meant for, listed above the
   * rest.
   */
  suggestedTypes?: PropertyType[];

  /**
   * Callback fired with the picked property's name, or undefined
   * when the None option is picked.
   */
  onValueChange: (property: string | undefined) => void;
}

// The icon the picker's trigger and its none option carry, held
// steady whichever property is picked.
const PropertyIcon = 'braces';

// Width of the menu panel, wide enough for a property name beside
// its type icon.
const MenuWidth = 260;

/**
 * Renders the picker for the property an element takes its content
 * from: a toolbar toggle opening a searchable menu of the
 * compatible properties, the ones the element is meant for first.
 */
export const DesignPropertyPicker: React.FC<DesignPropertyPickerProps> = ({
  properties,
  value,
  types,
  suggestedTypes = [],
  onValueChange,
}) => {
  const { t } = useTranslation();

  // The properties the element can take, split into the types it is
  // meant for and the rest.
  const compatible = properties.filter((property) =>
    types.includes(property.type),
  );
  const suggested = compatible.filter((property) =>
    suggestedTypes.includes(property.type),
  );
  const others = compatible.filter(
    (property) => !suggestedTypes.includes(property.type),
  );

  // The picked property, absent once it is no longer offered
  const picked = properties.find((property) => property.name === value);

  // Renders a property's menu item
  function renderItem(property: PropertySchema) {
    return (
      <DropdownSearchableMenuItem
        key={property.name}
        stringLabel={property.name}
        contentIcon={property.icon}
        onSelect={() => onValueChange(property.name)}
      />
    );
  }

  return (
    <DropdownMenu
      searchable
      side="right"
      align="start"
      sideOffset={BlockControlOffset}
      minWidth={MenuWidth}
      searchPlaceholder="designsNext.property.search"
      emptyText={t('designsNext.property.noMatching')}
      trigger={
        <ToolbarIconButton
          variant="subtle"
          icon={PropertyIcon}
          label="designsNext.property.label"
          tooltip={{
            side: 'right',
            sideOffset: BlockControlOffset,
            title: 'designsNext.property.label',
            // The picked property's name stands in for the
            // description, which says what a property is for.
            description: picked
              ? undefined
              : 'designsNext.property.description',
            stringDescription: picked?.name,
          }}
        />
      }
    >
      {/* Clearing the mapping, an explicit option rather than
          unpicking the picked property */}
      <MenuGroup>
        <DropdownSearchableMenuItem
          label="designsNext.property.none"
          icon={PropertyIcon}
          onSelect={() => onValueChange(undefined)}
        />
      </MenuGroup>

      <DropdownMenuSeparator />

      {suggested.length > 0 && (
        <MenuGroup>
          <MenuLabel label="designsNext.property.suggested" />
          {suggested.map(renderItem)}
        </MenuGroup>
      )}

      {others.length > 0 && (
        <MenuGroup>
          {/* The rest are labelled only once something sits above
              them to be told apart from */}
          {suggested.length > 0 && (
            <MenuLabel label="designsNext.property.other" />
          )}
          {others.map(renderItem)}
        </MenuGroup>
      )}
    </DropdownMenu>
  );
};
