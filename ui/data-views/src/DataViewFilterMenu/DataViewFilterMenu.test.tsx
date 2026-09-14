import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataView, DataViews } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { DataViewFilterMenu } from './DataViewFilterMenu';

const { dataView_gallery_1, dataViewType_table } = DataViewFixtures;
const { urlDatabase } = DatabaseFixtures;

// A filterable view listing the URL database's entries
const filterableView: DataView = {
  ...dataView_gallery_1,
  type: dataViewType_table.type,
  dataSource: { type: 'database', id: urlDatabase.id },
};

describe('<DataViewFilterMenu />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders nothing for view types which are not filterable', () => {
    render(<DataViewFilterMenu view={dataView_gallery_1} />);

    expect(screen.queryByLabelText('Filter')).not.toBeInTheDocument();
  });

  it("lists the view's database properties", async () => {
    DataViews.Store.load([filterableView]);

    render(<DataViewFilterMenu view={filterableView} />);

    await userEvent.click(screen.getByLabelText('Filter'));

    expect(screen.getByText('URL')).toBeInTheDocument();
  });

  it("persists the view's filters", async () => {
    DataViews.Store.load([filterableView]);

    render(<DataViewFilterMenu view={filterableView} />);

    await userEvent.click(screen.getByLabelText('Filter'));
    await userEvent.click(screen.getByText('URL'));
    await userEvent.type(await screen.findByPlaceholderText('Value'), 'foo');
    await userEvent.click(screen.getByText('Done'));

    await waitFor(() => {
      expect(DataViews.get(filterableView.id)?.options?.filters).toEqual([
        {
          property: 'URL',
          propertyType: 'url',
          operator: 'equals',
          value: 'foo',
        },
      ]);
    });
  });
});
