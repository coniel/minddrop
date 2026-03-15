import { useMemo } from 'react';
import { Database, Databases } from '@minddrop/databases';
import { Design, DesignType, Designs } from '@minddrop/designs';
import { createI18nKeyBuilder } from '@minddrop/i18n';
import {
  DropdownRadioSubmenu,
  DropdownRadioSubmenuItem,
  MenuGroup,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
} from '@minddrop/ui-primitives';

const designTypeI18nKey = createI18nKeyBuilder('designs.');

/**
 * Value representing the database default design. Consumers
 * should treat this as "no override, use the database default".
 */
export const DATABASE_DEFAULT_DESIGN = 'default';

export interface DatabaseDesignSelectionMenuProps {
  /**
   * One or more database IDs whose mapped designs to list.
   * When multiple IDs are provided, each database is rendered
   * as its own radio submenu (ignoring the `submenu` prop).
   */
  databaseId: string | string[];

  /**
   * The design type to filter by (e.g. 'card', 'list', 'page').
   */
  designType: DesignType;

  /**
   * The currently selected design ID. When not set or set to
   * 'default', the "Database default" option is shown as active.
   */
  value?: string;

  /**
   * Callback fired when a design is selected. Called with
   * 'default' when the "Database default" option is selected.
   */
  onValueChange?: (designId: string) => void;

  /**
   * When true, renders as a submenu trigger with the "[Type]
   * design" label and selected design name as value label.
   * Ignored when multiple database IDs are provided.
   */
  submenu?: boolean;
}

/**
 * Renders a radio menu group of designs of a given type that are
 * mapped to one or more databases, allowing the user to select one.
 */
export const DatabaseDesignSelectionMenu: React.FC<
  DatabaseDesignSelectionMenuProps
> = ({ databaseId, designType, value, onValueChange, submenu }) => {
  const allDatabases = Databases.useAll();
  const allDesigns = Designs.useAll();

  const databaseIds = Array.isArray(databaseId) ? databaseId : [databaseId];
  const isMulti = Array.isArray(databaseId) && databaseId.length > 1;

  // Collect databases and their mapped designs of the requested type
  const databaseDesigns = useMemo(() => {
    const result: { database: Database; designs: Design[] }[] = [];

    for (const id of databaseIds) {
      const database = allDatabases.find((database) => database.id === id);

      if (!database) {
        continue;
      }

      const mappedDesignIds = Object.keys(database.designPropertyMaps);

      const designs = allDesigns.filter(
        (design) =>
          design.type === designType && mappedDesignIds.includes(design.id),
      );

      if (designs.length) {
        result.push({ database, designs });
      }
    }

    return result;
  }, [allDatabases, allDesigns, databaseIds, designType]);

  if (!databaseDesigns.length) {
    return null;
  }

  // Resolve the active value, falling back to 'default'
  const activeValue = value || DATABASE_DEFAULT_DESIGN;

  // Multiple databases: render a submenu per database
  if (isMulti) {
    return (
      <>
        {databaseDesigns.map(({ database, designs }) => (
          <SubmenuMode
            key={database.id}
            label={(<>{database.name}</>) as React.ReactElement}
            designs={designs}
            value={activeValue}
            onValueChange={onValueChange}
          />
        ))}
      </>
    );
  }

  // Single database, submenu mode
  if (submenu) {
    return (
      <SubmenuMode
        label={designTypeI18nKey(designType, 'design')}
        designs={databaseDesigns[0].designs}
        value={activeValue}
        onValueChange={onValueChange}
      />
    );
  }

  // Single database, inline mode
  return (
    <MenuGroup>
      <MenuLabel label={designTypeI18nKey(designType, 'design')} />
      <MenuRadioGroup value={activeValue} onValueChange={onValueChange}>
        <MenuRadioItem
          value={DATABASE_DEFAULT_DESIGN}
          label="databases.designs.databaseDefault"
        />
        {databaseDesigns[0].designs.map((design) => (
          <MenuRadioItem key={design.id} value={design.id}>
            {design.name}
          </MenuRadioItem>
        ))}
      </MenuRadioGroup>
    </MenuGroup>
  );
};

interface SubmenuModeProps {
  label: React.ReactElement | string;
  designs: Design[];
  value: string;
  onValueChange?: (designId: string) => void;
}

/**
 * Renders the design selection as a DropdownRadioSubmenu.
 */
function SubmenuMode({
  label,
  designs,
  value,
  onValueChange,
}: SubmenuModeProps) {
  // Build the items array for DropdownRadioSubmenu
  const items = useMemo<DropdownRadioSubmenuItem[]>(
    () => [
      {
        value: DATABASE_DEFAULT_DESIGN,
        label: 'databases.designs.databaseDefault' as const,
      },
      ...designs.map((design) => ({
        value: design.id,
        label: (<>{design.name}</>) as React.ReactElement,
      })),
    ],
    [designs],
  );

  return (
    <DropdownRadioSubmenu
      label={label}
      items={items}
      value={value}
      onValueChange={onValueChange}
    />
  );
}
