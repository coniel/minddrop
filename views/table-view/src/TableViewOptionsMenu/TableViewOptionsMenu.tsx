import React, { useCallback, useMemo } from 'react';
import { Databases } from '@minddrop/databases';
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

  // Build the set of hidden column IDs
  const hiddenColumns = useMemo(
    () => new Set(options.hiddenColumns ?? []),
    [options.hiddenColumns],
  );

  // Toggle a column's visibility
  const handleToggleColumn = useCallback(
    (columnId: string, visible: boolean) => {
      const current = new Set(options.hiddenColumns ?? []);

      if (visible) {
        current.delete(columnId);
      } else {
        current.add(columnId);
      }

      onUpdateOptions({ hiddenColumns: Array.from(current) });
    },
    [options.hiddenColumns, onUpdateOptions],
  );

  // Get the list of columns that can be toggled
  const toggleableColumns = useMemo(() => {
    if (!database) {
      return [];
    }

    return database.properties.filter((property) =>
      SUPPORTED_TYPES.has(property.type),
    );
  }, [database]);

  return (
    <DropdownMenuContent className="table-view-options-menu">
      {/* Column visibility submenu */}
      <DropdownSubmenu>
        <DropdownSubmenuTriggerItem label={t('columns')} icon="columns-3" />
        <DropdownMenuPortal>
          <DropdownMenuPositioner side="right" align="start" sideOffset={4}>
            <DropdownSubmenuContent minWidth={180}>
              {toggleableColumns.map((property) => (
                <DropdownMenuSwitchItem
                  key={property.name}
                  label={property.name}
                  checked={!hiddenColumns.has(property.name)}
                  onCheckedChange={(checked) =>
                    handleToggleColumn(property.name, checked)
                  }
                />
              ))}
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
