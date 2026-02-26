import React, { useCallback, useEffect, useRef } from 'react';
import { NumberField } from '@minddrop/ui-primitives';
import { useTableEditContext } from '../TableEditContext';
import { TableColumn } from '../types';
import './NumberCell.css';

interface NumberCellProps {
  value: string;
  column: TableColumn;
  size: 'sm' | 'md' | 'lg';
}

function parseNum(v: string): number | undefined {
  if (!v) {
    return undefined;
  }

  const n = Number(v);

  return isNaN(n) ? undefined : n;
}

export const NumberCell: React.FC<NumberCellProps> = ({ value }) => {
  const { activeCell, onCellChange, deactivate } = useTableEditContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const latestRef = useRef<number | null>(parseNum(value) ?? null);

  useEffect(() => {
    const input = containerRef.current?.querySelector<HTMLInputElement>('input');
    input?.focus();
  }, []);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (e.currentTarget.contains(e.relatedTarget as Node)) {
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

  const handleValueChange = useCallback((v: number | null) => {
    latestRef.current = v;
  }, []);

  return (
    <div ref={containerRef} className="number-cell" onBlur={handleBlur}>
      <NumberField
        variant="ghost"
        defaultValue={parseNum(value)}
        onValueChange={handleValueChange}
      />
    </div>
  );
};

NumberCell.displayName = 'NumberCell';
