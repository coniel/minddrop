import React from 'react';
import { ContentView, ContentViewTypes } from '@minddrop/content-views';
import { Text, TransientViewStateScope } from '@minddrop/ui-primitives';
import { useFilteredContentViewEntries } from '../useFilteredContentViewEntries';
import { useSortedContentViewEntries } from '../useSortedContentViewEntries';
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

  return <ConfiguredView view={view} entries={entries} />;
};

interface ConfiguredViewProps {
  /**
   * The content view to render.
   */
  view: ContentView;

  /**
   * IDs of the elements to render within the content view.
   */
  entries?: string[];
}

/**
 * Renders the content view's type component.
 */
const ConfiguredView: React.FC<ConfiguredViewProps> = ({ view, entries }) => {
  const viewType = ContentViewTypes.use(view.type);

  // Entries matching the view's filters, in the order configured
  // by its sort options.
  const filteredEntries = useFilteredContentViewEntries(
    view,
    entries ?? NO_ENTRIES,
  );
  const sortedEntries = useSortedContentViewEntries(view, filteredEntries);

  if (!viewType) {
    return null;
  }

  return (
    <div className="content-view-renderer">
      <TransientViewStateScope segment={view.id}>
        <viewType.component view={view} entries={sortedEntries} />
      </TransientViewStateScope>
    </div>
  );
};
