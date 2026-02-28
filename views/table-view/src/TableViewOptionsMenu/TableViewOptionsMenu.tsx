import React from 'react';
import { useTranslation } from '@minddrop/i18n';
import {
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSwitchItem,
  MenuLabel,
} from '@minddrop/ui-primitives';
import { ViewTypeSettingsMenuProps } from '@minddrop/views';
import { TablePadding, TableViewOptions } from '../types';
import './TableViewOptionsMenu.css';

export const TableViewOptionsMenu: React.FC<
  ViewTypeSettingsMenuProps<TableViewOptions>
> = ({ options, onUpdateOptions }) => {
  const { t } = useTranslation({ keyPrefix: 'views.table.options' });

  return (
    <DropdownMenuContent className="table-view-options-menu">
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
