import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  ContentViewTypeComponentProps,
  ContentViewTypes,
  ContentViews,
} from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { cleanup as cleanupRender, render, screen } from '@minddrop/test-utils';
import { cleanup, setup } from '../../../test-utils';
import { ContentViewDesignElement } from './ContentViewDesignElement';

const { element_content_view_1 } = DesignFixtures;
const { contentView_gallery_1, contentViewType_gallery } = ContentViewFixtures;

// A query sourced content view. Rendering it needs no loaded
// database.
const queryContentView = {
  ...contentView_gallery_1,
  dataSource: { type: 'query' as const, id: 'query-1' },
};

describe('<ContentViewDesignElement />', () => {
  beforeEach(() => {
    // Load the workspace and design fixtures
    setup();

    // Register a view type which renders the view's name
    ContentViewTypes.register({
      ...contentViewType_gallery,
      component: TestViewTypeComponent,
    });

    // Load the query sourced content view
    ContentViews.Store.load([queryContentView]);
  });

  afterEach(async () => {
    cleanupRender();
    await cleanup();
    ContentViews.Store.clear();
    ContentViewTypes.unregister(contentViewType_gallery.type);
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

    // The view type renders the resolved view
    expect(screen.getByTestId('view').textContent).toBe(queryContentView.name);
  });
});

/**
 * Renders the received view's name for assertion.
 */
function TestViewTypeComponent({ view }: ContentViewTypeComponentProps) {
  return <div data-testid="view">{view.name}</div>;
}
