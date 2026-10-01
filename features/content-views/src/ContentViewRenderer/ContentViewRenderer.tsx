import React from 'react';
import { ContentView } from '@minddrop/content-views';
import { Text } from '@minddrop/ui-primitives';
import { ConfiguredView } from './ConfiguredView';
import { CreateContentViewForm } from './CreateContentViewForm';
import './ContentViewRenderer.css';

// Stable empty list used when the renderer is given no entries
const NO_ENTRIES: string[] = [];

export interface ContentViewRendererProps {
  /**
   * The content view to render. When omitted, a view creation form
   * is rendered instead.
   */
  view?: ContentView;

  /**
   * Whether the referenced view no longer exists. Renders a
   * missing view notice instead of the creation form.
   */
  viewDeleted?: boolean;

  /**
   * The type of view created by the creation form. Required to
   * render the form when no view is provided.
   */
  createViewType?: string;

  /**
   * Called with the newly created view after the creation form
   * is submitted.
   */
  onCreateView?: (view: ContentView) => void;

  /**
   * IDs of the elements to render within the content view.
   */
  entries?: string[];
}

/**
 * Renders a content view. Without a view it renders a view creation
 * form, or a missing view notice when the referenced view no longer
 * exists.
 */
export const ContentViewRenderer: React.FC<ContentViewRendererProps> = ({
  view,
  viewDeleted,
  createViewType,
  onCreateView,
  entries,
}) => {
  // The referenced view no longer exists
  if (viewDeleted) {
    return (
      <div className="content-view-renderer content-view-renderer-empty">
        <Text size="sm" color="muted" text="contentViews.missing.message" />
      </div>
    );
  }

  // No view yet: render the creation form
  if (!view) {
    if (!createViewType) {
      return null;
    }

    return (
      <div className="content-view-renderer content-view-renderer-empty">
        <CreateContentViewForm
          viewType={createViewType}
          onCreateView={onCreateView}
        />
      </div>
    );
  }

  return <ConfiguredView view={view} entries={entries ?? NO_ENTRIES} />;
};
