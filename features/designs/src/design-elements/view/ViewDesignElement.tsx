import React from 'react';
import { Collections } from '@minddrop/collections';
import { ViewElement, createViewCssStyle } from '@minddrop/designs';
import { Icon, Text } from '@minddrop/ui-primitives';
import { ViewTypes, Views } from '@minddrop/views';
import { useElementProperty } from '../../DesignPropertiesProvider';
import './ViewDesignElement.css';

export interface ViewDesignElementProps {
  /**
   * The view element to render.
   */
  element: ViewElement;

  /**
   * Optional props to spread on the root DOM element.
   */
  rootProps?: Record<string, unknown>;
}

/**
 * Renders a view design element. When a property is mapped,
 * the property value is a view ID. The view is looked up
 * from the store and rendered using its view type component.
 */
export const ViewDesignElement: React.FC<ViewDesignElementProps> = ({
  element,
  rootProps,
}) => {
  const property = useElementProperty(element.id);

  // The property value is the ID of the view to render
  const viewId =
    property?.value && typeof property.value === 'string'
      ? property.value
      : undefined;

  // Look up the view from the store
  const view = Views.use(viewId ?? '');

  // Get entries from the view's collection data source
  const collectionId =
    view?.dataSource.type === 'collection' ? view.dataSource.id : undefined;
  const collection = Collections.use(collectionId ?? '');

  // Look up the registered view type
  const viewType = ViewTypes.use(element.viewType);

  // Dynamic styles from the element's style config.
  // Fill the container vertically when no explicit height is set.
  const cssStyle = createViewCssStyle(element.style);
  const rootStyle = rootProps?.style as React.CSSProperties | undefined;
  const mergedStyle = {
    ...(!element.style.height && { flex: 1 }),
    ...cssStyle,
    ...rootStyle,
  };

  // Show skeleton when no property is mapped (e.g. in the
  // design studio or property mapping preview)
  if (!property) {
    return (
      <div {...rootProps} className="design-view-element" style={mergedStyle}>
        {viewType ? (
          React.createElement(viewType.skeletonComponent)
        ) : (
          <div className="design-view-element-placeholder">
            <Icon name="app-window" className="design-view-element-icon" />
            <Text
              size="sm"
              className="design-view-element-text"
              text="designs.view.placeholder"
            />
          </div>
        )}
      </div>
    );
  }

  // Render the view type component
  return (
    <div {...rootProps} className="design-view-element" style={mergedStyle}>
      {viewType &&
        view &&
        React.createElement(viewType.component, {
          view,
          entries: collection?.entries ?? [],
        })}
    </div>
  );
};
