import { createContext } from 'react';
import { TableColumnAlignment } from '@minddrop/ast';

/**
 * The alignment of a table's columns, provided by the table element to the
 * cells rendered inside it.
 */
export const TableAlignContext = createContext<TableColumnAlignment[]>([]);
