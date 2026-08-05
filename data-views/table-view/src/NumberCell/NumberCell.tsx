import React, { useCallback, useEffect, useRef } from 'react';
import { NumberInput } from '@minddrop/ui-primitives';
import { useTableEditContext } from '../TableEditContext';
import { TableColumn } from '../types';
import './NumberCell.css';

interface NumberCellProps {
  /**
   * The cell's string-encoded number value.
   */
  value: string;

  /**
   * The column configuration.
   */
  column: TableColumn;

  /**
   * The field size variant.
   */
  size: 'sm' | 'md' | 'lg';
}

/**
 * Renders a number input cell that saves on blur.
 */
export const NumberCell: React.FC<NumberCellProps> = ({ value }) => {
  const { activeCell, onCellChange, deactivate } = useTableEditContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const latestRef = useRef<number | null>(parseNum(value) ?? null);

  // Auto-focus the input when the cell becomes active
  useEffect(() => {
    const input =
      containerRef.current?.querySelector<HTMLInputElement>('input');
    input?.focus();
  }, []);

  // Save the value and deactivate when focus leaves the cell
  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      if (event.currentTarget.contains(event.relatedTarget as Node)) {
        return;
      }

      const newValue =
        latestRef.current !== null ? String(latestRef.current) : '';

      if (newValue !== value) {
        onCellChange(activeCell!.rowId, activeCell!.columnId, newValue);
      }

      deactivate();
    },
    [value, onCellChange, activeCell, deactivate],
  );

  // Track the latest value without triggering re-renders
  const handleValueChange = useCallback((newValue: number | null) => {
    latestRef.current = newValue;
  }, []);

  return (
    <div ref={containerRef} className="number-cell" onBlur={handleBlur}>
      <NumberInput
        variant="ghost"
        size="sm"
        defaultValue={parseNum(value)}
        onValueChange={handleValueChange}
      />
    </div>
  );
};

NumberCell.displayName = 'NumberCell';

function parseNum(value: string): number | undefined {
  if (!value) {
    return undefined;
  }

  const number = Number(value);

  return isNaN(number) ? undefined : number;
}
