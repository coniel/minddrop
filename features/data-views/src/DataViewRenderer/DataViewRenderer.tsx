import React, { useCallback } from 'react';
import { Collections } from '@minddrop/collections';
import { DataView, DataViewTypes } from '@minddrop/data-views';
import { CreateDatabaseEntryButton } from '@minddrop/ui-databases';
import {
  ContentIcon,
  Heading,
  Text,
  Toolbar,
  TransientViewStateScope,
} from '@minddrop/ui-primitives';
import { DataViewOptionsMenu } from '../DataViewOptionsMenu';
import { useSortedDataViewEntries } from '../useSortedDataViewEntries';
import { CreateDataViewForm } from './CreateDataViewForm';
import './DataViewRenderer.css';

// Stable empty list used when the renderer is given no entries
const NO_ENTRIES: string[] = [];

export interface DataViewRendererProps {
  /**
   * The data view to render. When omitted, a view creation form
   * is rendered instead.
   */
  view?: DataView;

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
  onCreateView?: (view: DataView) => void;

  /**
   * IDs of the elements to render within the data view.
   */
  entries?: string[];

  /**
   * Whether to show the header above the view content.
   * Displays the view's name and icon, along with settings
   * and new entry buttons.
   */
  showHeader?: boolean;
}

/**
 * Renders a data view with an optional header. Without a view it
 * renders a view creation form, or a missing view notice when the
 * referenced view no longer exists.
 */
export const DataViewRenderer: React.FC<DataViewRendererProps> = ({
  view,
  viewDeleted,
  createViewType,
  onCreateView,
  entries,
  showHeader,
}) => {
  // The referenced view no longer exists
  if (viewDeleted) {
    return (
      <div className="data-view-renderer data-view-renderer-empty">
        <Text size="sm" color="muted" text="dataViews.missing.message" />
      </div>
    );
  }

  // No view yet: render the creation form
  if (!view) {
    if (!createViewType) {
      return null;
    }

    return (
      <div className="data-view-renderer data-view-renderer-empty">
        <CreateDataViewForm
          viewType={createViewType}
          onCreateView={onCreateView}
        />
      </div>
    );
  }

  return (
    <ConfiguredView view={view} entries={entries} showHeader={showHeader} />
  );
};

interface ConfiguredViewProps {
  /**
   * The data view to render.
   */
  view: DataView;

  /**
   * IDs of the elements to render within the data view.
   */
  entries?: string[];

  /**
   * Whether to show the header above the view content.
   */
  showHeader?: boolean;
}

/**
 * Renders the data view's type component with an optional header.
 */
const ConfiguredView: React.FC<ConfiguredViewProps> = ({
  view,
  entries,
  showHeader,
}) => {
  const viewType = DataViewTypes.use(view.type);

  // Entries in the order configured by the view's sort options
  const sortedEntries = useSortedDataViewEntries(view, entries ?? NO_ENTRIES);

  // Add newly created entry to the collection when
  // the view's data source is a collection
  const handleCreateEntry = useCallback(
    (entry: { id: string }) => {
      if (view.dataSource.type === 'collection') {
        Collections.addItems(view.dataSource.id, [entry.id]);
      }
    },
    [view.dataSource],
  );

  if (!viewType) {
    return null;
  }

  return (
    <div className="data-view-renderer">
      {/* Header with view icon, name, and action buttons */}
      {showHeader && (
        <div className="data-view-renderer-header">
          <div className="data-view-renderer-title">
            {view.icon && <ContentIcon icon={view.icon} />}
            <Heading noMargin>{view.name}</Heading>
          </div>
          <Toolbar>
            <CreateDatabaseEntryButton
              database={
                view.dataSource.type === 'database' ? view.dataSource.id : false
              }
              onCreateEntry={handleCreateEntry}
              color="neutral"
            />
            <DataViewOptionsMenu view={view} />
          </Toolbar>
        </div>
      )}

      {/* View content */}
      <TransientViewStateScope segment={view.id}>
        <viewType.component view={view} entries={sortedEntries} />
      </TransientViewStateScope>
    </div>
  );
};
