import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import {
  TableCellElement,
  TableElement,
  TableRowElement,
} from './TableElement.types';
import { stringifyTableElementToPlainText } from './stringifyTableElementToPlainText';

function generateRow(cells: string[]): TableRowElement {
  return generateElement<TableRowElement>('table-row', {
    children: cells.map((text) =>
      generateElement<TableCellElement>('table-cell', {
        children: [{ text }],
      }),
    ),
  });
}

function generateTable(rows: string[][]): TableElement {
  return generateElement<TableElement>('table', {
    align: [],
    children: rows.map(generateRow),
  });
}

describe('stringifyTableElementToPlainText', () => {
  it('separates cells with tabs and rows with newlines', () => {
    const table = generateTable([
      ['a', 'b'],
      ['c', 'd'],
    ]);

    expect(stringifyTableElementToPlainText(table)).toBe('a\tb\nc\td');
  });

  it('returns an empty string for a table with no rows', () => {
    const table = generateTable([]);

    expect(stringifyTableElementToPlainText(table)).toBe('');
  });
});
