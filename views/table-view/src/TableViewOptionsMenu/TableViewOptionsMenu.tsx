import React from 'react';
import { useTranslation } from '@minddrop/i18n';
import {
  IconButton,
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverTrigger,
  RadioToggleGroup,
  Switch,
  Toggle,
} from '@minddrop/ui-primitives';
import { TablePadding } from '../types';
import './TableViewOptionsMenu.css';

interface TableViewOptionsMenuProps {
  padding: TablePadding;
  showRowNumbers: boolean;
  rowSeparator: boolean;
  columnSeparator: boolean;
  highlightOnHover: boolean;
  onPaddingChange: (padding: TablePadding) => void;
  onShowRowNumbersChange: (show: boolean) => void;
  onRowSeparatorChange: (show: boolean) => void;
  onColumnSeparatorChange: (show: boolean) => void;
  onHighlightOnHoverChange: (show: boolean) => void;
}

export const TableViewOptionsMenu: React.FC<TableViewOptionsMenuProps> = ({
  padding,
  showRowNumbers,
  rowSeparator,
  columnSeparator,
  highlightOnHover,
  onPaddingChange,
  onShowRowNumbersChange,
  onRowSeparatorChange,
  onColumnSeparatorChange,
  onHighlightOnHoverChange,
}) => {
  const { t } = useTranslation({ keyPrefix: 'views.table.options' });

  return (
    <div className="table-view-options-menu">
      <Popover>
        <PopoverTrigger>
          <IconButton
            icon="settings-2"
            label={t('title')}
            variant="ghost"
            size="sm"
          />
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverPositioner side="top" align="center">
            <PopoverContent
              className="table-view-options-content"
              minWidth={200}
            >
              <div className="table-view-options-row">
                <span className="table-view-options-label">
                  {t('rowNumbers')}
                </span>
                <Switch
                  size="sm"
                  checked={showRowNumbers}
                  onCheckedChange={onShowRowNumbersChange}
                />
              </div>
              <div className="table-view-options-row">
                <span className="table-view-options-label">
                  {t('rowSeparator')}
                </span>
                <Switch
                  size="sm"
                  checked={rowSeparator}
                  onCheckedChange={onRowSeparatorChange}
                />
              </div>
              <div className="table-view-options-row">
                <span className="table-view-options-label">
                  {t('columnSeparator')}
                </span>
                <Switch
                  size="sm"
                  checked={columnSeparator}
                  onCheckedChange={onColumnSeparatorChange}
                />
              </div>
              <div className="table-view-options-row">
                <span className="table-view-options-label">
                  {t('highlightOnHover')}
                </span>
                <Switch
                  size="sm"
                  checked={highlightOnHover}
                  onCheckedChange={onHighlightOnHoverChange}
                />
              </div>
              <div className="table-view-options-row">
                <span className="table-view-options-label">{t('padding')}</span>
                <RadioToggleGroup
                  value={padding}
                  onValueChange={(v) => onPaddingChange(v as TablePadding)}
                  size="sm"
                >
                  <Toggle icon="rows-4" label={t('compact')} value="compact" />
                  <Toggle
                    icon="rows-3"
                    label={t('comfortable')}
                    value="comfortable"
                  />
                  <Toggle
                    icon="rows-2"
                    label={t('spacious')}
                    value="spacious"
                  />
                </RadioToggleGroup>
              </div>
            </PopoverContent>
          </PopoverPositioner>
        </PopoverPortal>
      </Popover>
    </div>
  );
};
