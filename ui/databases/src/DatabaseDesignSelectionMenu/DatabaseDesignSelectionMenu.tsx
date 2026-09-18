import { useMemo } from 'react';
import { Database, Databases } from '@minddrop/databases';
import { Design, DesignType, Designs } from '@minddrop/designs-next';
import { TranslationKey, createI18nKeyBuilder } from '@minddrop/i18n';
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownRadioSubmenu,
  DropdownRadioSubmenuItem,
  MenuGroup,
  MenuLabel,
} from '@minddrop/ui-primitives';
import { orderByCreated, reconcileIdOrder } from '@minddrop/utils';

const designTypeI18nKey = createI18nKeyBuilder('databases.design.types.');

/**
 * Value representing the database's default design. Consumers
 * should treat this as "no override, use the database default".
 */
export const DATABASE_DEFAULT_DESIGN = 'default';

export interface DatabaseDesignSelectionMenuProps {
  /**
   * One or more database IDs whose designs to list. When multiple
   * IDs are provided, each database is rendered as its own radio
   * submenu (ignoring the `submenu` prop).
   */
  databaseId: string | string[];

  /**
   * The design type to filter by (e.g. 'card', 'list', 'page').
   */
  designType: DesignType;

  /**
   * The currently selected design ID. When not set or set to
   * 'default', the "Database default" option is shown as active.
   *
   * When multiple database IDs are provided, a Record keyed by
   * database ID can be used to track per-database selections.
   */
  value?: string | Record<string, string>;

  /**
   * Callback fired when a design is selected. Called with 'default'
   * when the "Database default" option is selected.
   *
   * When multiple database IDs are provided, the second argument
   * contains the database ID that the selection belongs to.
   */
  onValueChange?: (designId: string, databaseId?: string) => void;

  /**
   * When true, renders as a submenu trigger with the "[Type]
   * design" label and selected design name as value label.
   * Ignored when multiple database IDs are provided.
   */
  submenu?: boolean;
}

/**
 * Renders a radio menu group of the databases' designs of a given
 * type, allowing the user to select one. Databases owning no design
 * of the type are omitted.
 */
export const DatabaseDesignSelectionMenu: React.FC<
  DatabaseDesignSelectionMenuProps
> = ({ databaseId, designType, value, onValueChange, submenu }) => {
  const allDatabases = Databases.useAll();
  const allDesigns = Designs.useAll();

  // Memoised so the array identity is stable between renders, keeping it
  // usable as a dependency below.
  const databaseIds = useMemo(
    () => (Array.isArray(databaseId) ? databaseId : [databaseId]),
    [databaseId],
  );
  const isMulti = Array.isArray(databaseId);

  // Collect the databases and their designs of the requested type,
  // in the order the database lists them
  const databaseDesigns = useMemo(() => {
    const result: { database: Database; designs: Design[] }[] = [];

    for (const id of databaseIds) {
      const database = allDatabases.find((database) => database.id === id);

      // Skip IDs no loaded database answers to
      if (!database) {
        continue;
      }

      // The database's own designs of the requested type
      const owned = allDesigns.filter(
        (design) => design.owner === database.id && design.type === designType,
      );

      // Leave out a database with no design of the type rather than
      // listing it with the default option alone.
      if (!owned.length) {
        continue;
      }

      // List the designs in the database's display order, placing
      // designs missing from it after the ordered ones by creation
      // date.
      result.push({
        database,
        designs: reconcileIdOrder(database.designs, owned, orderByCreated),
      });
    }

    return result;
  }, [allDatabases, allDesigns, databaseIds, designType]);

  if (!databaseDesigns.length) {
    return null;
  }

  // Multiple databases: render a labeled group with a submenu per database
  if (isMulti) {
    return (
      <MenuGroup>
        <MenuLabel label={designTypeI18nKey(designType, 'label')} />
        {databaseDesigns.map(({ database, designs }) => {
          // Resolve the per-database value from the value map or string
          const databaseValue =
            typeof value === 'object'
              ? value[database.id] || DATABASE_DEFAULT_DESIGN
              : value || DATABASE_DEFAULT_DESIGN;

          return (
            <SubmenuMode
              key={database.id}
              stringLabel={database.name}
              designs={designs}
              value={databaseValue}
              onValueChange={(designId) =>
                onValueChange?.(designId, database.id)
              }
            />
          );
        })}
      </MenuGroup>
    );
  }

  // Resolve the active value for single-database modes
  const resolvedValue =
    (typeof value === 'string' ? value : undefined) || DATABASE_DEFAULT_DESIGN;

  // Single database, submenu mode
  if (submenu) {
    return (
      <SubmenuMode
        label={designTypeI18nKey(designType, 'label')}
        designs={databaseDesigns[0].designs}
        value={resolvedValue}
        onValueChange={onValueChange}
      />
    );
  }

  // Single database, inline mode
  return (
    <MenuGroup>
      <MenuLabel label={designTypeI18nKey(designType, 'label')} />
      <DropdownMenuRadioGroup
        value={resolvedValue}
        onValueChange={(designId) => onValueChange?.(designId)}
      >
        <DropdownMenuRadioItem
          value={DATABASE_DEFAULT_DESIGN}
          label="databases.design.databaseDefault"
        />
        {databaseDesigns[0].designs.map((design) => (
          <DropdownMenuRadioItem
            key={design.id}
            value={design.id}
            stringLabel={design.name}
          />
        ))}
      </DropdownMenuRadioGroup>
    </MenuGroup>
  );
};

interface SubmenuModeProps {
  label?: TranslationKey;
  stringLabel?: string;
  designs: Design[];
  value: string;
  onValueChange?: (designId: string) => void;
}

/**
 * Renders the design selection as a DropdownRadioSubmenu.
 */
function SubmenuMode({
  label,
  stringLabel,
  designs,
  value,
  onValueChange,
}: SubmenuModeProps) {
  // Build the items array for DropdownRadioSubmenu
  const items = useMemo<DropdownRadioSubmenuItem[]>(
    () => [
      {
        value: DATABASE_DEFAULT_DESIGN,
        label: 'databases.design.databaseDefault' as const,
      },
      ...designs.map((design) => ({
        value: design.id,
        stringLabel: design.name,
      })),
    ],
    [designs],
  );

  return (
    <DropdownRadioSubmenu
      {...(stringLabel ? { stringLabel } : { label })}
      items={items}
      value={value}
      onValueChange={onValueChange}
    />
  );
}
