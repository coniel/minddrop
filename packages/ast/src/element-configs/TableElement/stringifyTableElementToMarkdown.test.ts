import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import {
  TableCellElement,
  TableColumnAlignment,
  TableElement,
  TableRowElement,
} from './TableElement.types';
import { stringifyTableElementToMarkdown } from './stringifyTableElementToMarkdown';

function generateRow(cells: string[]): TableRowElement {
  return generateElement<TableRowElement>('table-row', {
    children: cells.map((text) =>
      generateElement<TableCellElement>('table-cell', {
        children: [{ text }],
      }),
    ),
  });
}

function generateTable(
  rows: string[][],
  align: TableColumnAlignment[] = [],
): TableElement {
  return generateElement<TableElement>('table', {
    align,
    children: rows.map(generateRow),
  });
}

describe('stringifyTableElementToMarkdown', () => {
  it('stringifies a table', () => {
    const table = generateTable([
      ['a', 'b'],
      ['c', 'd'],
    ]);

    expect(stringifyTableElementToMarkdown(table)).toBe(
      '| a | b |\n| --- | --- |\n| c | d |',
    );
  });

  it('stringifies column alignment', () => {
    const table = generateTable(
      [['a', 'b', 'c', 'd']],
      ['left', 'right', 'center', null],
    );

    expect(stringifyTableElementToMarkdown(table)).toBe(
      '| a | b | c | d |\n| :--- | ---: | :---: | --- |',
    );
  });

  it('escapes pipes in cell content', () => {
    const table = generateTable([['a | b']]);

    expect(stringifyTableElementToMarkdown(table)).toBe('| a \\| b |\n| --- |');
  });

  it('returns an empty string for a table with no rows', () => {
    const table = generateTable([]);

    expect(stringifyTableElementToMarkdown(table)).toBe('');
  });
});
