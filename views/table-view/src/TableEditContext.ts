import { createContext, useContext } from 'react';

interface TableEditContextValue {
  activeCell: { rowId: string; columnId: string } | null;
  onCellChange: (rowId: string, columnId: string, value: string) => void;
  deactivate: () => void;
}

export const TableEditContext = createContext<TableEditContextValue>({
  activeCell: null,
  onCellChange: () => undefined,
  deactivate: () => undefined,
});

export const useTableEditContext = () => useContext(TableEditContext);
