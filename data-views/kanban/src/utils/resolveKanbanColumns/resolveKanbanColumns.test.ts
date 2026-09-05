import { describe, expect, it } from 'vitest';
import { DatabaseEntry, DatabaseEntryId } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { initializeI18n } from '@minddrop/i18n';
import { statusProperty } from '../../test-utils';
import { resolveKanbanColumns } from './resolveKanbanColumns';

const { objectEntry1 } = DatabaseFixtures;

// Initialize translations used for the no-value column's label
initializeI18n();

// Entries with each of the fixture property's option values, and
// one with no value at all.
const todoEntry = withStatus('database-entry_todo', 'Todo');
const doneEntry = withStatus('database-entry_done', 'Done');
const otherDoneEntry = withStatus('database-entry_other-done', 'Done');
const unsetEntry = withStatus('database-entry_unset', undefined);

describe('resolveKanbanColumns', () => {
  it('generates a column per declared option', () => {
    const columns = resolveKanbanColumns([], statusProperty, {});

    expect(columns).toEqual([
      { value: 'Todo', label: 'Todo', color: 'blue', entryIds: [] },
      { value: 'Done', label: 'Done', color: 'green', entryIds: [] },
    ]);
  });

  it('leaves out the no-value column when empty', () => {
    const columns = resolveKanbanColumns([todoEntry], statusProperty, {});

    expect(columns.some((column) => column.value === '')).toBe(false);
  });

  it('puts the no-value column first when it has entries', () => {
    const columns = resolveKanbanColumns(
      [todoEntry, unsetEntry],
      statusProperty,
      {},
    );

    expect(columns[0]).toEqual({
      value: '',
      label: 'No value',
      entryIds: [unsetEntry.id],
    });
  });

  it('places entries in the column of their property value', () => {
    const columns = resolveKanbanColumns(
      [todoEntry, doneEntry, unsetEntry],
      statusProperty,
      {},
    );

    expect(columnEntries(columns, '')).toEqual([unsetEntry.id]);
    expect(columnEntries(columns, 'Todo')).toEqual([todoEntry.id]);
    expect(columnEntries(columns, 'Done')).toEqual([doneEntry.id]);
  });

  it('orders a column by the saved order', () => {
    const columns = resolveKanbanColumns(
      [doneEntry, otherDoneEntry],
      statusProperty,
      { Done: [otherDoneEntry.id, doneEntry.id] },
    );

    expect(columnEntries(columns, 'Done')).toEqual([
      otherDoneEntry.id,
      doneEntry.id,
    ]);
  });

  it('prepends entries the saved order does not place', () => {
    const columns = resolveKanbanColumns(
      [doneEntry, otherDoneEntry],
      statusProperty,
      { Done: [otherDoneEntry.id] },
    );

    expect(columnEntries(columns, 'Done')).toEqual([
      doneEntry.id,
      otherDoneEntry.id,
    ]);
  });

  it('drops saved entries which are no longer in the column', () => {
    const columns = resolveKanbanColumns([doneEntry], statusProperty, {
      Done: [otherDoneEntry.id, doneEntry.id],
    });

    expect(columnEntries(columns, 'Done')).toEqual([doneEntry.id]);
  });
});

/**
 * Builds an entry fixture holding the given status value.
 *
 * @param id - The ID to give the entry.
 * @param status - The status value the entry holds, if any.
 * @returns The entry fixture.
 */
function withStatus(
  id: DatabaseEntryId,
  status: string | undefined,
): DatabaseEntry {
  return {
    ...objectEntry1,
    id,
    properties: { ...objectEntry1.properties, Status: status ?? null },
  };
}

/**
 * Looks up the entries placed in a column, so that the
 * expectations do not depend on which columns are present.
 *
 * @param columns - The board's columns.
 * @param value - The option value keying the column.
 * @returns The IDs of the entries in the column.
 */
function columnEntries(
  columns: ReturnType<typeof resolveKanbanColumns>,
  value: string,
): string[] | undefined {
  return columns.find((column) => column.value === value)?.entryIds;
}
