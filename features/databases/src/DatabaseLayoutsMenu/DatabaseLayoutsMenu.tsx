import { useCallback } from 'react';
import { Databases } from '@minddrop/databases';
import { Layout, LayoutType, Layouts } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import {
  OpenPropertyMapperEvent,
  OpenPropertyMapperEventData,
} from '@minddrop/feature-designs';
import { createI18nKeyBuilder } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuTrigger,
  IconButton,
  MenuGroup,
  MenuItem,
  MenuItemDropdownMenu,
  MenuLabel,
} from '@minddrop/ui-primitives';

const layoutTypeI18nKey = createI18nKeyBuilder('designs.layouts.');

export interface DatabaseLayoutsMenuProps
  extends React.HTMLProps<HTMLDivElement> {
  /**
   * The ID of the database to which the layouts belong.
   */
  databaseId: string;
}

const LAYOUT_TYPES: LayoutType[] = ['page', 'card', 'list'];

const layoutTypeIconMap: Record<string, UiIconName> = {
  page: 'layout',
  card: 'layout-grid',
  list: 'layout-list',
};

/**
 * Renders a grouped list of layouts that the database has
 * property mappings for, with per-item options to set as
 * default or remove.
 */
export const DatabaseLayoutsMenu: React.FC<DatabaseLayoutsMenuProps> = ({
  databaseId,
}) => {
  const databaseConfig = Databases.use(databaseId);
  const allLayouts = Layouts.useAll();

  // Sets the layout as the default for its type on this database
  const handleSetAsDefault = useCallback(
    (layout: Layout) => {
      if (!databaseConfig) {
        return;
      }

      Databases.update(databaseId, {
        defaultLayouts: {
          ...databaseConfig.defaultLayouts,
          [layout.type]: layout.id,
        },
      });
    },
    [databaseId, databaseConfig],
  );

  // Removes the layout's property map from this database. Reads/writes
  // the legacy field directly; the phase 8 cutover will replace this
  // menu with the Design tab's design-level property mapping.
  const handleRemove = useCallback(
    (layoutId: string) => {
      if (!databaseConfig) {
        return;
      }

      const { [layoutId]: _removed, ...remainingMaps } =
        databaseConfig.layoutPropertyMaps;

      Databases.update(databaseId, { layoutPropertyMaps: remainingMaps });
    },
    [databaseId, databaseConfig],
  );

  // Opens the property mapping tool for the given layout
  const handleOpenMapper = useCallback(
    (layoutId: string) => {
      Events.dispatch<OpenPropertyMapperEventData>(OpenPropertyMapperEvent, {
        databaseId,
        layoutId,
      });
    },
    [databaseId],
  );

  if (!databaseConfig) {
    return null;
  }

  // Get the layout IDs that the database has property mappings for
  const mappedLayoutIds = Object.keys(databaseConfig.layoutPropertyMaps);

  // Filter layouts to only those with mappings in this database
  const mappedLayouts = allLayouts.filter((layout) =>
    mappedLayoutIds.includes(layout.id),
  );

  return (
    <div>
      {LAYOUT_TYPES.map((type) => {
        // Filter mapped layouts by type
        const typeLayouts = mappedLayouts.filter(
          (layout) => layout.type === type,
        );

        if (!typeLayouts.length) {
          return null;
        }

        return (
          <MenuGroup key={type}>
            <MenuLabel label={layoutTypeI18nKey(type, 'name')} />
            {typeLayouts.map((layout) => {
              // Check if this layout is the current default for its type
              const isDefault =
                databaseConfig.defaultLayouts[layout.type] === layout.id;

              return (
                <MenuItem
                  key={layout.id}
                  icon={isDefault ? 'star' : layoutTypeIconMap[layout.type]}
                  muted
                  onClick={() => handleOpenMapper(layout.id)}
                  actions={
                    <LayoutItemActions
                      layout={layout}
                      isDefault={isDefault}
                      onSetAsDefault={handleSetAsDefault}
                      onRemove={handleRemove}
                    />
                  }
                >
                  {layout.name}
                </MenuItem>
              );
            })}
          </MenuGroup>
        );
      })}
    </div>
  );
};

interface LayoutItemActionsProps {
  /**
   * The layout this actions menu belongs to.
   */
  layout: Layout;

  /**
   * Whether this layout is the current default for its type.
   */
  isDefault: boolean;

  /**
   * Callback to set this layout as the default.
   */
  onSetAsDefault: (layout: Layout) => void;

  /**
   * Callback to remove this layout from the database.
   */
  onRemove: (layoutId: string) => void;
}

/**
 * Renders the dropdown options menu for a layout menu item.
 */
function LayoutItemActions({
  layout,
  isDefault,
  onSetAsDefault,
  onRemove,
}: LayoutItemActionsProps) {
  return (
    <MenuItemDropdownMenu>
      <DropdownMenuTrigger>
        <IconButton
          size="sm"
          icon="more-horizontal"
          label="databases.layouts.actions.manage"
        />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuPositioner side="bottom" align="start">
          <DropdownMenuContent>
            <MenuGroup>
              <DropdownMenuItem
                icon="star"
                label="databases.layouts.actions.setAsDefault"
                disabled={isDefault}
                onSelect={() => onSetAsDefault(layout)}
              />
              <DropdownMenuItem
                icon="x"
                label="databases.layouts.actions.remove"
                danger
                onSelect={() => onRemove(layout.id)}
              />
            </MenuGroup>
          </DropdownMenuContent>
        </DropdownMenuPositioner>
      </DropdownMenuPortal>
    </MenuItemDropdownMenu>
  );
}
