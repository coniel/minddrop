import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataView, DataViews } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { DataViewSortMenu } from './DataViewSortMenu';

const { dataView_gallery_1, dataViewType_table } = DataViewFixtures;
const { urlDatabase } = DatabaseFixtures;

// A sortable view listing the URL database's entries
const sortableView: DataView = {
  ...dataView_gallery_1,
  type: dataViewType_table.type,
  dataSource: { type: 'database', id: urlDatabase.id },
};

// Opens the sort menu
async function openMenu() {
  await userEvent.click(screen.getByLabelText('Sort'));
}

describe('<DataViewSortMenu />', () => {
  beforeEach(() => {
    setup();

    DataViews.Store.load([sortableView]);
  });

  afterEach(cleanup);

  it('lists the metadata and database properties', async () => {
    render(<DataViewSortMenu view={sortableView} />);

    await openMenu();

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Last modified')).toBeInTheDocument();
    expect(screen.getByText('URL')).toBeInTheDocument();
  });

  it('sorts by the selected property', async () => {
    render(<DataViewSortMenu view={sortableView} />);

    await openMenu();
    await userEvent.click(screen.getByText('URL'));

    await waitFor(() => {
      expect(DataViews.get(sortableView.id)?.options).toMatchObject({
        sortBy: 'property',
        sortProperty: 'URL',
      });
    });
  });

  it('sorts in the selected direction', async () => {
    render(<DataViewSortMenu view={sortableView} />);

    await openMenu();
    await userEvent.click(screen.getByText('Ascending'));

    await waitFor(() => {
      expect(DataViews.get(sortableView.id)?.options).toMatchObject({
        sortDirection: 'ascending',
      });
    });
  });

  it('renders nothing for view types which are not sortable', () => {
    render(<DataViewSortMenu view={dataView_gallery_1} />);

    expect(screen.queryByLabelText('Sort')).not.toBeInTheDocument();
  });
});
