// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { DatabaseFixtures, MockFs } from '@minddrop/databases/test-utils';
import { storeItem } from '@minddrop/stores/test-utils';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { defaultTableViewOptions } from '../constants';
import { cleanup, setup } from '../test-utils';
import { TableViewComponent } from './TableView';

const { contentView_table_1 } = ContentViewFixtures;
const { titledObjectDatabase, objectEntry1, databaseDirPath } =
  DatabaseFixtures;

// A table of the object database
const view = {
  ...contentView_table_1,
  dataSource: { type: 'database' as const, id: titledObjectDatabase.id },
  options: defaultTableViewOptions,
};

describe('TableViewComponent', () => {
  beforeEach(() => {
    setup();

    // Give the object database a title property. The table then
    // renders a title column.
    Databases.Store.update(titledObjectDatabase.id, titledObjectDatabase);
  });

  afterEach(cleanup);

  it("renders an entry's title cell", () => {
    render(<TableViewComponent view={view} entries={[objectEntry1.id]} />);

    expect(screen.getByDisplayValue(objectEntry1.title)).toBeInTheDocument();
  });

  // Pins Issue 44: Clearing a title cell renames the entry file to the
  // hidden '.md'. Remove .fails once fixed.
  it.fails(
    'does not rename the entry file to a hidden file when its title cell is cleared',
    async () => {
      render(<TableViewComponent view={view} entries={[objectEntry1.id]} />);

      // Clear the entry's title cell and leave it
      const input = screen.getByDisplayValue(objectEntry1.title);
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.focusOut(input);

      // Let the rename run
      await vi.runAllTimersAsync();

      expect(
        MockFs.exists(`${databaseDirPath(titledObjectDatabase)}/.md`),
      ).toBe(false);
      expect(storeItem(DatabaseEntries.Store, objectEntry1.id).title).not.toBe(
        '',
      );
    },
  );
});
