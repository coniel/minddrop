import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentViews } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { cleanup as cleanupRender, render, screen } from '@minddrop/test-utils';
import { cleanup, setup } from '../../../test-utils';
import { ContentViewDesignElement } from './ContentViewDesignElement';

const { element_content_view_1 } = DesignFixtures;

// A query sourced content view, so that rendering it does not depend
// on a loaded database.
const queryContentView = {
  ...ContentViewFixtures.contentView_gallery_1,
  dataSource: { type: 'query' as const, id: 'query-1' },
};

describe('<ContentViewDesignElement />', () => {
  beforeEach(() => {
    setup();
    ContentViews.Store.load([queryContentView]);
  });

  afterEach(async () => {
    cleanupRender();
    await cleanup();
    ContentViews.Store.clear();
  });

  it('renders the creation form when the element has no content view', () => {
    render(<ContentViewDesignElement element={element_content_view_1} />);

    // The creation form names the view being created
    expect(screen.queryByText('contentViews.form.name.label')).not.toBeNull();
  });

  it('renders the missing view notice for a dangling reference', () => {
    render(
      <ContentViewDesignElement
        element={{ ...element_content_view_1, content: 'missing-content-view' }}
      />,
    );

    expect(screen.queryByText('contentViews.missing.message')).not.toBeNull();
  });

  it('renders the referenced content view', () => {
    render(
      <ContentViewDesignElement
        element={{ ...element_content_view_1, content: queryContentView.id }}
      />,
    );

    // The header names the resolved view, and neither the creation
    // form nor the missing view notice is shown.
    expect(screen.queryByText(queryContentView.name)).not.toBeNull();
    expect(screen.queryByText('contentViews.missing.message')).toBeNull();
  });
});
