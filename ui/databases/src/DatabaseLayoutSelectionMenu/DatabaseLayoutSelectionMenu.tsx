import { useMemo } from 'react';
import { Database, Databases } from '@minddrop/databases';
import { Designs, Layout, LayoutType } from '@minddrop/designs';
import { TranslationKey, createI18nKeyBuilder } from '@minddrop/i18n';
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownRadioSubmenu,
  DropdownRadioSubmenuItem,
  MenuGroup,
  MenuLabel,
} from '@minddrop/ui-primitives';

const layoutTypeI18nKey = createI18nKeyBuilder('designs.layouts.');

/**
 * Value representing the database default layout. Consumers
 * should treat this as "no override, use the database default".
 */
export const DATABASE_DEFAULT_LAYOUT = 'default';

export interface DatabaseLayoutSelectionMenuProps {
  /**
   * One or more database IDs whose design layouts to list.
   * When multiple IDs are provided, each database is rendered
   * as its own radio submenu (ignoring the `submenu` prop).
   */
  databaseId: string | string[];

  /**
   * The layout type to filter by (e.g. 'card', 'list', 'page').
   */
  layoutType: LayoutType;

  /**
   * The currently selected layout ID. When not set or set to
   * 'default', the "Database default" option is shown as active.
   *
   * When multiple database IDs are provided, a Record keyed by
   * database ID can be used to track per-database selections.
   */
  value?: string | Record<string, string>;

  /**
   * Callback fired when a layout is selected. Called with
   * 'default' when the "Database default" option is selected.
   *
   * When multiple database IDs are provided, the second argument
   * contains the database ID that the selection belongs to.
   */
  onValueChange?: (layoutId: string, databaseId?: string) => void;

  /**
   * When true, renders as a submenu trigger with the "[Type]
   * layout" label and selected layout name as value label.
   * Ignored when multiple database IDs are provided.
   */
  submenu?: boolean;
}

/**
 * Renders a radio menu group of layouts of a given type from the
 * databases' designs, allowing the user to select one. Databases
 * without a design are omitted.
 */
export const DatabaseLayoutSelectionMenu: React.FC<
  DatabaseLayoutSelectionMenuProps
> = ({ databaseId, layoutType, value, onValueChange, submenu }) => {
  const allDatabases = Databases.useAll();
  const allDesigns = Designs.useAll();

  // Memoised so the array identity is stable between renders, keeping it
  // usable as a dependency below
  const databaseIds = useMemo(
    () => (Array.isArray(databaseId) ? databaseId : [databaseId]),
    [databaseId],
  );
  const isMulti = Array.isArray(databaseId);

  // Collect databases and their design's layouts of the requested type
  const databaseLayouts = useMemo(() => {
    const result: { database: Database; layouts: Layout[] }[] = [];

    for (const id of databaseIds) {
      const database = allDatabases.find((database) => database.id === id);
      const design = allDesigns.find(
        (design) => design.id === database?.designId,
      );

      if (!database || !design) {
        continue;
      }

      const layouts = design.layouts.filter(
        (layout) => layout.type === layoutType,
      );

      result.push({ database, layouts });
    }

    return result;
  }, [allDatabases, allDesigns, databaseIds, layoutType]);

  if (!databaseLayouts.length) {
    return null;
  }

  // Multiple databases: render a labeled group with a submenu per database
  if (isMulti) {
    return (
      <MenuGroup>
        <MenuLabel label={layoutTypeI18nKey(layoutType, 'label')} />
        {databaseLayouts.map(({ database, layouts }) => {
          // Resolve the per-database value from the value map or string
          const databaseValue =
            typeof value === 'object'
              ? value[database.id] || DATABASE_DEFAULT_LAYOUT
              : value || DATABASE_DEFAULT_LAYOUT;

          return (
            <SubmenuMode
              key={database.id}
              stringLabel={database.name}
              layouts={layouts}
              value={databaseValue}
              onValueChange={(layoutId) =>
                onValueChange?.(layoutId, database.id)
              }
            />
          );
        })}
      </MenuGroup>
    );
  }

  // Resolve the active value for single-database modes
  const resolvedValue =
    (typeof value === 'string' ? value : undefined) || DATABASE_DEFAULT_LAYOUT;

  // Single database, submenu mode
  if (submenu) {
    return (
      <SubmenuMode
        label={layoutTypeI18nKey(layoutType, 'label')}
        layouts={databaseLayouts[0].layouts}
        value={resolvedValue}
        onValueChange={onValueChange}
      />
    );
  }

  // Single database, inline mode
  return (
    <MenuGroup>
      <MenuLabel label={layoutTypeI18nKey(layoutType, 'label')} />
      <DropdownMenuRadioGroup
        value={resolvedValue}
        onValueChange={(layoutId) => onValueChange?.(layoutId)}
      >
        <DropdownMenuRadioItem
          value={DATABASE_DEFAULT_LAYOUT}
          label="databases.layouts.databaseDefault"
        />
        {databaseLayouts[0].layouts.map((layout) => (
          <DropdownMenuRadioItem
            key={layout.id}
            value={layout.id}
            stringLabel={layout.name}
          />
        ))}
      </DropdownMenuRadioGroup>
    </MenuGroup>
  );
};

interface SubmenuModeProps {
  label?: TranslationKey;
  stringLabel?: string;
  layouts: Layout[];
  value: string;
  onValueChange?: (layoutId: string) => void;
}

/**
 * Renders the layout selection as a DropdownRadioSubmenu.
 */
function SubmenuMode({
  label,
  stringLabel,
  layouts,
  value,
  onValueChange,
}: SubmenuModeProps) {
  // Build the items array for DropdownRadioSubmenu
  const items = useMemo<DropdownRadioSubmenuItem[]>(
    () => [
      {
        value: DATABASE_DEFAULT_LAYOUT,
        label: 'databases.layouts.databaseDefault' as const,
      },
      ...layouts.map((layout) => ({
        value: layout.id,
        stringLabel: layout.name,
      })),
    ],
    [layouts],
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
