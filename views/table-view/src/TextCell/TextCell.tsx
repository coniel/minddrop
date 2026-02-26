import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTableEditContext } from '../TableEditContext';
import { TableColumn } from '../types';
import './TextCell.css';

interface TextCellProps {
  value: string;
  column: TableColumn;
  size: 'sm' | 'md' | 'lg';
}

export const TextCell: React.FC<TextCellProps> = ({ value, size }) => {
  const { activeCell, onCellChange, deactivate } = useTableEditContext();
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelRef = useRef(false);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleBlur = useCallback(() => {
    if (!cancelRef.current && localValue !== value) {
      onCellChange(activeCell!.rowId, activeCell!.columnId, localValue);
    }

    cancelRef.current = false;
    deactivate();
  }, [localValue, value, onCellChange, activeCell, deactivate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      cancelRef.current = true;
      inputRef.current?.blur();
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  }, []);

  return (
    <input
      ref={inputRef}
      className={`text-cell-input text-cell-input--${size}`}
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
};

TextCell.displayName = 'TextCell';
