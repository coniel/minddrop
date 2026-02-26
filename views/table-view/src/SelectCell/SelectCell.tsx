import React, { useCallback } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
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

  const handleValueChange = useCallback(
    (newValue: string) => {
      onCellChange(activeCell!.rowId, activeCell!.columnId, newValue);
      deactivate();
    },
    [activeCell, onCellChange, deactivate],
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
    <DropdownMenu open={true} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger>
        <div className="select-cell" data-open>
          <span className="select-cell-value">{value}</span>
          <Icon name="chevron-down" className="select-cell-chevron" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuPositioner align="start">
          <DropdownMenuContent minWidth={260}>
            <DropdownMenuRadioGroup
              value={value}
              onValueChange={handleValueChange}
            >
              {options.map((option) => (
                <DropdownMenuRadioItem
                  key={option.value}
                  value={option.value}
                  label={option.label}
                />
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenuPositioner>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};

SelectCell.displayName = 'SelectCell';
