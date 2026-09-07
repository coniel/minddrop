import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataView, DataViews } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { render, screen } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { DatabaseBrowseMode } from './DatabaseBrowseMode';

const { objectDatabase } = DatabaseFixtures;
const { dataView_gallery_1 } = DataViewFixtures;

// A table view of the object database, the table type being the one
// registered by the test setup.
const tableView: DataView = {
  ...dataView_gallery_1,
  id: 'data-view_objects-table',
  type: 'table',
  name: 'Objects table',
  dataSource: { type: 'database', id: objectDatabase.id },
};

describe('<DatabaseBrowseMode />', () => {
  beforeEach(() => {
    setup();
    DataViews.Store.load([tableView]);
  });

  afterEach(async () => {
    await cleanup();
    DataViews.Store.clear();
  });

  it("renders the database's views in the switcher", () => {
    const { container } = render(
      <DatabaseBrowseMode databaseId={objectDatabase.id} />,
    );

    expect(container.querySelector('.database-view-switcher')).not.toBeNull();
    screen.getByText(tableView.name);
  });

  it('hides the switcher when the views toolbar is disabled', () => {
    Databases.Store.load([{ ...objectDatabase, hideViewsToolbar: true }]);

    const { container } = render(
      <DatabaseBrowseMode databaseId={objectDatabase.id} />,
    );

    expect(container.querySelector('.database-view-switcher')).toBeNull();
  });

  it('renders nothing for a missing database', () => {
    const { container } = render(<DatabaseBrowseMode databaseId="missing" />);

    expect(container.querySelector('.database-view-switcher')).toBeNull();
  });
});
