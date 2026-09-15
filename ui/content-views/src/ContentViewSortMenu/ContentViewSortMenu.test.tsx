import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentView, ContentViews } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { ContentViewSortMenu } from './ContentViewSortMenu';

const { contentView_gallery_1, contentViewType_table } = ContentViewFixtures;
const { urlDatabase } = DatabaseFixtures;

// A sortable view listing the URL database's entries
const sortableView: ContentView = {
  ...contentView_gallery_1,
  type: contentViewType_table.type,
  dataSource: { type: 'database', id: urlDatabase.id },
};

// Opens the sort menu
async function openMenu() {
  await userEvent.click(screen.getByLabelText('Sort'));
}

describe('<ContentViewSortMenu />', () => {
  beforeEach(() => {
    setup();

    ContentViews.Store.load([sortableView]);
  });

  afterEach(cleanup);

  it('lists the metadata and database properties', async () => {
    render(<ContentViewSortMenu view={sortableView} />);

    await openMenu();

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Last modified')).toBeInTheDocument();
    expect(screen.getByText('URL')).toBeInTheDocument();
  });

  it('sorts by the selected property', async () => {
    render(<ContentViewSortMenu view={sortableView} />);

    await openMenu();
    await userEvent.click(screen.getByText('URL'));

    await waitFor(() => {
      expect(ContentViews.get(sortableView.id)?.options).toMatchObject({
        sortBy: 'property',
        sortProperty: 'URL',
      });
    });
  });

  it('sorts in the selected direction', async () => {
    render(<ContentViewSortMenu view={sortableView} />);

    await openMenu();
    await userEvent.click(screen.getByText('Ascending'));

    await waitFor(() => {
      expect(ContentViews.get(sortableView.id)?.options).toMatchObject({
        sortDirection: 'ascending',
      });
    });
  });

  it('renders nothing for view types which are not sortable', () => {
    render(<ContentViewSortMenu view={contentView_gallery_1} />);

    expect(screen.queryByLabelText('Sort')).not.toBeInTheDocument();
  });
});
