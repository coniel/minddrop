import { createContext, useContext } from 'react';

/**
 * Context for managing the active (editing) cell in the table view.
 * Only one cell can be active at a time. Non-active cells render
 * lightweight display components, switching to full editor components
 * when activated. This keeps the virtualised list performant by
 * avoiding heavy editor mounts on every visible row.
 */
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
