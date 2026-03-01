import React, { useCallback, useMemo } from 'react';
import { Databases } from '@minddrop/databases';
import { useSortableDrag } from '@minddrop/feature-drag-and-drop';
import { useTranslation } from '@minddrop/i18n';
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSwitchItem,
  DropdownSubmenu,
  DropdownSubmenuContent,
  DropdownSubmenuTriggerItem,
  Icon,
  MenuLabel,
} from '@minddrop/ui-primitives';
import { ViewTypeSettingsMenuProps } from '@minddrop/views';
import { TablePadding, TableViewOptions } from '../types';
import './TableViewOptionsMenu.css';

const SUPPORTED_TYPES = new Set(['text', 'title', 'number', 'select', 'date']);

export const TableViewOptionsMenu: React.FC<
  ViewTypeSettingsMenuProps<TableViewOptions>
> = ({ view, options, onUpdateOptions }) => {
  const { t } = useTranslation({ keyPrefix: 'views.table.options' });

  // Get the database to list available columns
  const databaseId =
    view.dataSource.type === 'database' ? view.dataSource.id : '';
  const database = Databases.use(databaseId);

  // Derive the set of hidden column IDs from the columns config
  const hiddenColumns = useMemo(
    () =>
      new Set(
        Object.entries(options.columns ?? {})
          .filter(([, config]) => config.hidden)
          .map(([id]) => id),
      ),
    [options.columns],
  );

  // Toggle a column's visibility via the per-column config
  const handleToggleColumn = useCallback(
    (columnId: string, visible: boolean) => {
      onUpdateOptions({
        columns: {
          [columnId]: {
            ...(options.columns ?? {})[columnId],
            hidden: !visible,
          },
        },
      });
    },
    [options.columns, onUpdateOptions],
  );

  // Get the list of columns that can be toggled, sorted
  // by the persisted column order
  const sortedColumns = useMemo(() => {
    if (!database) {
      return [];
    }

    const supported = database.properties.filter((property) =>
      SUPPORTED_TYPES.has(property.type),
    );

    const order = options.columnOrder ?? [];

    if (order.length === 0) {
      return supported;
    }

    // Sort by column order, placing unordered columns at the end
    const propertyMap = new Map(
      supported.map((property) => [property.name, property]),
    );
    const sorted: typeof supported = [];

    for (const id of order) {
      const property = propertyMap.get(id);

      if (property) {
        sorted.push(property);
        propertyMap.delete(id);
      }
    }

    for (const property of propertyMap.values()) {
      sorted.push(property);
    }

    return sorted;
  }, [database, options.columnOrder]);

  // Column IDs for the sortable drag hook
  const columnIds = useMemo(
    () => sortedColumns.map((property) => property.name),
    [sortedColumns],
  );

  // Persist the new column order on drag end
  const handleSort = useCallback(
    (columnOrder: string[]) => {
      onUpdateOptions({ columnOrder });
    },
    [onUpdateOptions],
  );

  // Sortable drag hook for vertical column reordering
  const sortableProps = useSortableDrag({
    items: columnIds,
    direction: 'vertical',
    gap: 0,
    onSort: handleSort,
  });

  return (
    <DropdownMenuContent className="table-view-options-menu">
      {/* Column visibility and order submenu */}
      <DropdownSubmenu>
        <DropdownSubmenuTriggerItem label={t('columns')} icon="columns-3" />
        <DropdownMenuPortal>
          <DropdownMenuPositioner side="right" align="start" sideOffset={4}>
            <DropdownSubmenuContent minWidth={220}>
              {sortedColumns.map((property) => {
                const dragProps = sortableProps.get(property.name);

                return (
                  <div
                    key={property.name}
                    ref={dragProps?.ref}
                    className={`table-view-column-item ${dragProps?.className ?? ''}`}
                    style={dragProps?.style}
                  >
                    {/* Drag handle */}
                    <span
                      className="table-view-column-item-handle"
                      {...dragProps?.handleProps}
                    >
                      <Icon name="grip-vertical" color="muted" />
                    </span>

                    {/* Switch item for toggling visibility */}
                    <DropdownMenuSwitchItem
                      label={property.name}
                      checked={!hiddenColumns.has(property.name)}
                      onCheckedChange={(checked) =>
                        handleToggleColumn(property.name, checked)
                      }
                    />
                  </div>
                );
              })}
            </DropdownSubmenuContent>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </DropdownSubmenu>

      <DropdownMenuSeparator />

      <DropdownMenuSwitchItem
        label={t('overflow')}
        checked={options.overflow}
        onCheckedChange={(overflow) => onUpdateOptions({ overflow })}
      />
      <DropdownMenuSwitchItem
        label={t('rowNumbers')}
        checked={options.showRowNumbers}
        onCheckedChange={(showRowNumbers) =>
          onUpdateOptions({ showRowNumbers })
        }
      />
      <DropdownMenuSwitchItem
        label={t('rowSeparator')}
        checked={options.rowSeparator}
        onCheckedChange={(rowSeparator) => onUpdateOptions({ rowSeparator })}
      />
      <DropdownMenuSwitchItem
        label={t('columnSeparator')}
        checked={options.columnSeparator}
        onCheckedChange={(columnSeparator) =>
          onUpdateOptions({ columnSeparator })
        }
      />
      <DropdownMenuSwitchItem
        label={t('highlightOnHover')}
        checked={options.highlightOnHover}
        onCheckedChange={(highlightOnHover) =>
          onUpdateOptions({ highlightOnHover })
        }
      />
      <DropdownMenuSwitchItem
        label={t('zebraStripes')}
        checked={options.zebraStripes}
        onCheckedChange={(zebraStripes) => onUpdateOptions({ zebraStripes })}
      />
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup
        value={options.padding}
        onValueChange={(value) =>
          onUpdateOptions({ padding: value as TablePadding })
        }
      >
        <MenuLabel label={t('padding')} />
        <DropdownMenuRadioItem
          label={t('compact')}
          value="compact"
          icon="rows-4"
        />
        <DropdownMenuRadioItem
          label={t('comfortable')}
          value="comfortable"
          icon="rows-3"
        />
        <DropdownMenuRadioItem
          label={t('spacious')}
          value="spacious"
          icon="rows-2"
        />
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  );
};
