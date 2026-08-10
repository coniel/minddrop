import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DataViewFixtures,
  DataViewTypeComponentProps,
  DataViewTypes,
  DataViews,
} from '@minddrop/data-views';
import { render, screen } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { DataViewView } from './DataViewView';

const { dataView_gallery_1, dataViewType_gallery } = DataViewFixtures;

// Result entry IDs returned by the mocked query execution
const queryResultIds = ['database-entry_1', 'database-entry_2'];

// A data view backed by a query data source
const queryDataView = {
  ...dataView_gallery_1,
  id: 'data-view_query-1',
  dataSource: { type: 'query' as const, id: 'query_1' },
};

// Mock query result execution, which requires a SQL database
vi.mock('@minddrop/queries', async (importOriginal) => {
  const original = await importOriginal<typeof import('@minddrop/queries')>();

  return {
    ...original,
    Queries: {
      ...original.Queries,
      useResults: (queryId: string) =>
        queryId === 'query_1' ? queryResultIds : [],
    },
  };
});

describe('<DataViewView />', () => {
  beforeEach(() => {
    setup();

    // Register a view type which renders its entry IDs
    DataViewTypes.register({
      ...dataViewType_gallery,
      component: TestViewTypeComponent,
    });

    // Load the query backed data view
    DataViews.Store.load([queryDataView]);
  });

  afterEach(() => {
    DataViewTypes.unregister(dataViewType_gallery.type);
    cleanup();
  });

  it('renders the query results as the view entries', () => {
    render(<DataViewView dataViewId={queryDataView.id} />);

    // The view receives the query's result entry IDs
    expect(screen.getByTestId('entries').textContent).toBe(
      queryResultIds.join(','),
    );
  });
});

/**
 * Renders the received entry IDs for assertion.
 */
function TestViewTypeComponent({ entries }: DataViewTypeComponentProps) {
  return <div data-testid="entries">{entries.join(',')}</div>;
}
