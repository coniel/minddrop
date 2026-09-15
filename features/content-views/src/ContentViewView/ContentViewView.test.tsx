import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ContentViewTypeComponentProps,
  ContentViewTypes,
  ContentViews,
} from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { render, screen } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { ContentViewView } from './ContentViewView';

const { contentView_gallery_1, contentViewType_gallery } = ContentViewFixtures;

// Result entry IDs returned by the mocked query execution
const queryResultIds = ['database-entry_1', 'database-entry_2'];

// A content view backed by a query data source
const queryContentView = {
  ...contentView_gallery_1,
  id: 'content-view_query-1',
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

describe('<ContentViewView />', () => {
  beforeEach(() => {
    setup();

    // Register a view type which renders its entry IDs
    ContentViewTypes.register({
      ...contentViewType_gallery,
      component: TestViewTypeComponent,
    });

    // Load the query backed content view
    ContentViews.Store.load([queryContentView]);
  });

  afterEach(async () => {
    ContentViewTypes.unregister(contentViewType_gallery.type);
    await cleanup();
  });

  it('renders the query results as the view entries', () => {
    render(<ContentViewView contentViewId={queryContentView.id} />);

    // The view receives the query's result entry IDs
    expect(screen.getByTestId('entries').textContent).toBe(
      queryResultIds.join(','),
    );
  });
});

/**
 * Renders the received entry IDs for assertion.
 */
function TestViewTypeComponent({ entries }: ContentViewTypeComponentProps) {
  return <div data-testid="entries">{entries.join(',')}</div>;
}
