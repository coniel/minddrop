import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentView, ContentViews } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { ContentViewFilterMenu } from './ContentViewFilterMenu';

const { contentView_gallery_1, contentViewType_table } = ContentViewFixtures;
const { urlDatabase } = DatabaseFixtures;

// A filterable view listing the URL database's entries
const filterableView: ContentView = {
  ...contentView_gallery_1,
  type: contentViewType_table.type,
  dataSource: { type: 'database', id: urlDatabase.id },
};

describe('<ContentViewFilterMenu />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders nothing for view types which are not filterable', () => {
    render(<ContentViewFilterMenu view={contentView_gallery_1} />);

    expect(screen.queryByLabelText('Filter')).not.toBeInTheDocument();
  });

  it("lists the view's database properties", async () => {
    ContentViews.Store.load([filterableView]);

    render(<ContentViewFilterMenu view={filterableView} />);

    await userEvent.click(screen.getByLabelText('Filter'));

    expect(screen.getByText('URL')).toBeInTheDocument();
  });

  it("persists the view's filters", async () => {
    ContentViews.Store.load([filterableView]);

    render(<ContentViewFilterMenu view={filterableView} />);

    await userEvent.click(screen.getByLabelText('Filter'));
    await userEvent.click(screen.getByText('URL'));
    await userEvent.type(await screen.findByPlaceholderText('Value'), 'foo');
    await userEvent.click(screen.getByText('Done'));

    await waitFor(() => {
      expect(ContentViews.get(filterableView.id)?.options?.filters).toEqual([
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
