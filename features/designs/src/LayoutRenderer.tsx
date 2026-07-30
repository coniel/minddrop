import { Layout } from '@minddrop/designs';
import { DesignRootElement } from './DesignElements';
import {
  DesignPropertiesProvider,
  DesignPropertiesProviderProps,
} from './DesignPropertiesProvider';

export interface LayoutRendererProps
  extends Pick<
    DesignPropertiesProviderProps,
    'onUpdatePropertyValue' | 'properties' | 'propertyValues' | 'propertyMap'
  > {
  /**
   * The layout to render.
   */
  layout: Layout;
}

/**
 * Renders a layout with real property values bound via propertyMap.
 * Wraps the layout tree in a DesignPropertiesProvider so that
 * child element renderers can access mapped property data.
 */
export const LayoutRenderer: React.FC<LayoutRendererProps> = ({
  layout,
  properties = [],
  propertyValues = {},
  propertyMap = {},
  onUpdatePropertyValue,
}) => {
  return (
    <DesignPropertiesProvider
      properties={properties}
      propertyValues={propertyValues}
      propertyMap={propertyMap}
      onUpdatePropertyValue={onUpdatePropertyValue}
    >
      <DesignRootElement element={layout.tree} />
    </DesignPropertiesProvider>
  );
};
