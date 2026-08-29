import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataViews } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { cleanup as cleanupRender, render, screen } from '@minddrop/test-utils';
import { cleanup, setup } from '../../test-utils';
import { DataViewDesignElement } from './DataViewDesignElement';

const { element_data_view_1 } = DesignFixtures;

// A query sourced data view, so that rendering it does not depend
// on a loaded database
const queryDataView = {
  ...DataViewFixtures.dataView_gallery_1,
  dataSource: { type: 'query' as const, id: 'query-1' },
};

describe('<DataViewDesignElement />', () => {
  beforeEach(() => {
    setup();
    DataViews.Store.load([queryDataView]);
  });

  afterEach(() => {
    cleanupRender();
    cleanup();
    DataViews.Store.clear();
  });

  it('renders the creation form when the element has no data view', () => {
    render(<DataViewDesignElement element={element_data_view_1} />);

    // The creation form names the view being created
    expect(screen.queryByText('dataViews.form.name.label')).not.toBeNull();
  });

  it('renders the missing view notice for a dangling reference', () => {
    render(
      <DataViewDesignElement
        element={{ ...element_data_view_1, content: 'missing-data-view' }}
      />,
    );

    expect(screen.queryByText('dataViews.missing.message')).not.toBeNull();
  });

  it('renders the referenced data view', () => {
    render(
      <DataViewDesignElement
        element={{ ...element_data_view_1, content: queryDataView.id }}
      />,
    );

    // The header names the resolved view, and neither the creation
    // form nor the missing view notice is shown
    expect(screen.queryByText(queryDataView.name)).not.toBeNull();
    expect(screen.queryByText('dataViews.missing.message')).toBeNull();
  });
});
