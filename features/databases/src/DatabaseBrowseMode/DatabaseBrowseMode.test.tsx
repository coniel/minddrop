import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentView, ContentViews } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { render, screen } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { DatabaseBrowseMode } from './DatabaseBrowseMode';

const { objectDatabase } = DatabaseFixtures;
const { contentView_gallery_1 } = ContentViewFixtures;

// A table view of the object database, the table type being the one
// registered by the test setup.
const tableView: ContentView = {
  ...contentView_gallery_1,
  id: 'content-view_objects-table',
  type: 'table',
  name: 'Objects table',
  dataSource: { type: 'database', id: objectDatabase.id },
};

describe('<DatabaseBrowseMode />', () => {
  beforeEach(() => {
    setup();
    ContentViews.Store.load([tableView]);
  });

  afterEach(async () => {
    await cleanup();
    ContentViews.Store.clear();
  });

  it("renders the database's views in the switcher", () => {
    const { container } = render(
      <DatabaseBrowseMode databaseId={objectDatabase.id} />,
    );

    expect(container.querySelector('.content-view-tab-bar')).not.toBeNull();
    screen.getByText(tableView.name);
  });

  it('hides the switcher when the views toolbar is disabled', () => {
    Databases.Store.load([{ ...objectDatabase, hideViewsToolbar: true }]);

    const { container } = render(
      <DatabaseBrowseMode databaseId={objectDatabase.id} />,
    );

    expect(container.querySelector('.content-view-tab-bar')).toBeNull();
  });

  it('renders nothing for a missing database', () => {
    const { container } = render(<DatabaseBrowseMode databaseId="missing" />);

    expect(container.querySelector('.content-view-tab-bar')).toBeNull();
  });
});
