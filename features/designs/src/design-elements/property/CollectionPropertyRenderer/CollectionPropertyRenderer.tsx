import React from 'react';
import { Collections } from '@minddrop/collections';
import { DataView, DataViewTypes, DataViews } from '@minddrop/data-views';
import {
  CollectionPropertyElement,
  getPropertyElementConfig,
  getPropertyElementVariant,
} from '@minddrop/designs';
import { DataViewRenderer } from '@minddrop/feature-data-views';
import { Icon, Text } from '@minddrop/ui-primitives';
import { useElementProperty } from '../../../DesignPropertiesProvider';
import { useElementCssStyle } from '../../../useElementCssStyle';
import './CollectionPropertyRenderer.css';

export interface CollectionPropertyRendererProps {
  /**
   * The collection property element to render.
   */
  element: CollectionPropertyElement;
}

/**
 * Display renderer for a collection property element. Renders the
 * bound property's view as an embedded data view of the selected
 * variant's view type; a view created in place is written to the
 * property value. Unmapped elements render the view type's
 * skeleton as a design-time stand-in.
 */
export const CollectionPropertyRenderer: React.FC<
  CollectionPropertyRendererProps
> = ({ element }) => {
  const property = useElementProperty(element.id);

  // The selected variant is the view type the view renders as
  const config = getPropertyElementConfig(element.propertyType);
  const variant = getPropertyElementVariant(config, element.variant);

  // The referenced view ID, from the bound property's value
  const viewId =
    property?.value && typeof property.value === 'string'
      ? property.value
      : undefined;

  // Look up the view from the store
  const view = DataViews.use(viewId ?? '');

  // Get entries from the view's collection data source
  const collectionId =
    view?.dataSource.type === 'collection' ? view.dataSource.id : undefined;
  const collection = Collections.use(collectionId ?? '');

  // Look up the registered view type
  const viewType = DataViewTypes.use(variant.id);

  const cssStyle = useElementCssStyle(element);

  // Write the created view to the bound property's value
  function handleCreateView(createdView: DataView) {
    property?.updateValue(createdView.id);
  }

  // Show the skeleton for unmapped elements (e.g. in the design
  // studio or property mapping preview)
  if (!property) {
    return (
      <div className="designs-collection-element" style={cssStyle}>
        {viewType ? (
          React.createElement(viewType.skeletonComponent)
        ) : (
          <div className="designs-collection-element-placeholder">
            <Icon
              name="app-window"
              className="designs-collection-element-icon"
            />
            <Text
              size="sm"
              className="designs-collection-element-text"
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
    <div className="designs-collection-element" style={cssStyle}>
      <DataViewRenderer
        showHeader
        view={view ?? undefined}
        viewDeleted={Boolean(viewId && !view)}
        createViewType={variant.id}
        onCreateView={handleCreateView}
        entries={collection?.items ?? []}
      />
    </div>
  );
};
