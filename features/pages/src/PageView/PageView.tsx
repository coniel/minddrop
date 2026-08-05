import { useCallback } from 'react';
import { LayoutRenderer } from '@minddrop/feature-designs';
import { Pages, setLayoutElementContent } from '@minddrop/pages';
import { IconButton, Panel, ScrollArea, Text } from '@minddrop/ui-primitives';
import { setPageViewState, usePageViewState } from '../PageViewStateStore';
import { PageEditMode } from './PageEditMode';
import './PageView.css';

export interface PageViewProps {
  /**
   * The ID of the page to display.
   */
  pageId: string;
}

/**
 * Renders a page's layout in a panel with an edit mode toggle
 * button.
 */
export const PageView: React.FC<PageViewProps> = ({ pageId }) => {
  const page = Pages.use(pageId);
  const { editing } = usePageViewState(pageId);

  // Persist element static content updates (e.g. a created view
  // reference) into the page's layout
  const handleUpdateElementContent = useCallback(
    (elementId: string, content: string) => {
      // The page cannot be updated once deleted
      if (!page) {
        return;
      }

      Pages.update(pageId, {
        layout: setLayoutElementContent(page.layout, elementId, content),
      });
    },
    [pageId, page],
  );

  function handleEdit() {
    setPageViewState(pageId, { editing: true });
  }

  // The page no longer exists
  if (!page) {
    return (
      <div className="page-view page-view-not-found">
        <Text color="muted" text="pages.view.notFound" />
      </div>
    );
  }

  // Render the in-place editor while in edit mode
  if (editing) {
    return <PageEditMode page={page} />;
  }

  return (
    <div className="page-view">
      <Panel className="page-view-panel">
        {/* Edit mode toggle */}
        <IconButton
          icon="palette"
          label="pages.view.actions.edit"
          tooltip={{ title: 'pages.view.actions.edit' }}
          color="muted"
          className="page-view-edit-button"
          onClick={handleEdit}
        />
        {/* The page's layout */}
        <ScrollArea className="page-view-content">
          <LayoutRenderer
            layout={page.layout}
            context="page"
            propertyMap={{}}
            propertyValues={{}}
            properties={[]}
            onUpdateElementContent={handleUpdateElementContent}
          />
        </ScrollArea>
      </Panel>
    </div>
  );
};
