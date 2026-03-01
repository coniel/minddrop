import React, { useCallback } from 'react';
import {
  Chip,
  DropdownMenu,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  Icon,
} from '@minddrop/ui-primitives';
import { useTableEditContext } from '../TableEditContext';
import { TableColumn } from '../types';
import './SelectCell.css';

interface SelectCellProps {
  value: string;
  column: TableColumn;
  size: 'sm' | 'md' | 'lg';
}

export const SelectCell: React.FC<SelectCellProps> = ({ value, column }) => {
  const { activeCell, onCellChange, deactivate } = useTableEditContext();
  const options = column.options ?? [];

  // Find the matching option to get its color
  const selectedOption = options.find((o) => o.value === value);

  // Whether to render values as colored chips
  const showChips = column.showChips !== false;

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (newValue !== value) {
        onCellChange(activeCell!.rowId, activeCell!.columnId, newValue);
      }

      deactivate();
    },
    [value, activeCell, onCellChange, deactivate],
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        deactivate();
      }
    },
    [deactivate],
  );

  return (
    <DropdownMenu
      open={true}
      onOpenChange={handleOpenChange}
      trigger={
        <div className="select-cell" data-open>
          {value ? (
            showChips ? (
              <Chip size="sm" color={selectedOption?.color || 'default'}>
                {value}
              </Chip>
            ) : (
              <span className="select-cell-text">{value}</span>
            )
          ) : null}
          <Icon name="chevron-down" className="select-cell-chevron" />
        </div>
      }
      minWidth={260}
    >
      <DropdownMenuRadioGroup value={value} onValueChange={handleValueChange}>
        {options.map((option) => (
          <DropdownMenuRadioItem
            key={option.value}
            value={option.value}
            label={
              <Chip size="sm" color={option.color || 'default'}>
                {option.label}
              </Chip>
            }
          />
        ))}
      </DropdownMenuRadioGroup>
    </DropdownMenu>
  );
};

SelectCell.displayName = 'SelectCell';
