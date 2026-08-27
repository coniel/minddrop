import React from 'react';
import { TableRowElement } from '@minddrop/ast';
import { BlockElementProps } from '../../types';

/**
 * Renders a table row.
 */
export const TableRowElementComponent: React.FC<
  BlockElementProps<TableRowElement>
> = ({ children, attributes }) => {
  return <tr {...attributes}>{children}</tr>;
};
