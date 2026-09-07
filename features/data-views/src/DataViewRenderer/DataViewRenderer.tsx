import React from 'react';
import { DataView, DataViewTypes } from '@minddrop/data-views';
import { Text, TransientViewStateScope } from '@minddrop/ui-primitives';
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
}

/**
 * Renders a data view. Without a view it renders a view creation
 * form, or a missing view notice when the referenced view no longer
 * exists.
 */
export const DataViewRenderer: React.FC<DataViewRendererProps> = ({
  view,
  viewDeleted,
  createViewType,
  onCreateView,
  entries,
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

  return <ConfiguredView view={view} entries={entries} />;
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
}

/**
 * Renders the data view's type component.
 */
const ConfiguredView: React.FC<ConfiguredViewProps> = ({ view, entries }) => {
  const viewType = DataViewTypes.use(view.type);

  // Entries in the order configured by the view's sort options
  const sortedEntries = useSortedDataViewEntries(view, entries ?? NO_ENTRIES);

  if (!viewType) {
    return null;
  }

  return (
    <div className="data-view-renderer">
      <TransientViewStateScope segment={view.id}>
        <viewType.component view={view} entries={sortedEntries} />
      </TransientViewStateScope>
    </div>
  );
};
