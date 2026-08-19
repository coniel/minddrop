import React from 'react';
import { Collections } from '@minddrop/collections';
import { DataView, DataViewTypes, DataViews } from '@minddrop/data-views';
import { ViewElement } from '@minddrop/designs';
import { DataViewRenderer } from '@minddrop/feature-data-views';
import { Icon, Text } from '@minddrop/ui-primitives';
import {
  useDesignProperties,
  useElementProperty,
} from '../../DesignPropertiesProvider';
import './ViewDesignElement.css';
import { useElementCssStyle } from '../../useElementCssStyle';

export interface ViewDesignElementProps {
  /**
   * The view element to render.
   */
  element: ViewElement;
}

/**
 * Renders a view design element. The referenced view ID comes
 * from the element's static content, or from its mapped property
 * value. Static elements without a view render a view creation
 * form; a dangling reference renders a missing view notice.
 */
export const ViewDesignElement: React.FC<ViewDesignElementProps> = ({
  element,
}) => {
  const property = useElementProperty(element.id);
  const context = useDesignProperties();

  // The referenced view ID: static content, or the mapped
  // property's value
  const propertyViewId =
    property?.value && typeof property.value === 'string'
      ? property.value
      : undefined;
  const viewId = element.static ? element.content : propertyViewId;

  // Look up the view from the store
  const view = DataViews.use(viewId ?? '');

  // Get entries from the view's collection data source
  const collectionId =
    view?.dataSource.type === 'collection' ? view.dataSource.id : undefined;
  const collection = Collections.use(collectionId ?? '');

  // Look up the registered view type
  const viewType = DataViewTypes.use(element.viewType);

  const cssStyle = useElementCssStyle(element);

  // Write the created view onto the element's static content
  function handleCreateView(createdView: DataView) {
    context?.onUpdateElementContent?.(element.id, createdView.id);
  }

  // Show skeleton for unmapped property bound elements (e.g. in
  // the design studio or property mapping preview)
  if (!element.static && !property) {
    return (
      <div className="designs-view-element" style={cssStyle}>
        {viewType ? (
          React.createElement(viewType.skeletonComponent)
        ) : (
          <div className="designs-view-element-placeholder">
            <Icon name="app-window" className="designs-view-element-icon" />
            <Text
              size="sm"
              className="designs-view-element-text"
              text="designsStudio.view.placeholder"
            />
          </div>
        )}
      </div>
    );
  }

  // Render the view, the creation form, or the missing view
  // notice as appropriate
  return (
    <div className="designs-view-element" style={cssStyle}>
      <DataViewRenderer
        showHeader
        view={view ?? undefined}
        viewDeleted={Boolean(viewId && !view)}
        createViewType={element.viewType}
        onCreateView={handleCreateView}
        entries={collection?.items ?? []}
      />
    </div>
  );
};
