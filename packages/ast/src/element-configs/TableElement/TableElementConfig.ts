import { ElementTypeConfig } from '../../types';
import { stringifyTableElementToMarkdown } from './stringifyTableElementToMarkdown';
import { stringifyTableElementToPlainText } from './stringifyTableElementToPlainText';

export const TableElementConfig: ElementTypeConfig = {
  type: 'table',
  level: 'block',
  content: 'table',
  toMarkdown: stringifyTableElementToMarkdown,
  toPlainText: stringifyTableElementToPlainText,
};

/**
 * Rows and cells are internal structure of the table block rather than
 * top-level blocks, so they are never serialized on their own.
 */
export const TableRowElementConfig: ElementTypeConfig = {
  type: 'table-row',
  level: 'block',
  content: 'table',
  toMarkdown: () => '',
};

export const TableCellElementConfig: ElementTypeConfig = {
  type: 'table-cell',
  level: 'block',
  content: 'inline',
  toMarkdown: () => '',
};
