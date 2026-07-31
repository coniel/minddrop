import { Layout } from '@minddrop/designs';
import { PropertiesSchema } from '@minddrop/properties';
import { DesignRootElement } from './DesignElements';
import {
  DesignPropertiesProvider,
  DesignPropertiesProviderProps,
  DesignPropertySchemasProvider,
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

  /**
   * The property schemas of the layout's parent design, used to
   * resolve element placeholder values.
   */
  designProperties?: PropertiesSchema;
}

/**
 * Renders a layout with real property values bound via propertyMap.
 * Wraps the layout tree in a DesignPropertiesProvider so that
 * child element renderers can access mapped property data.
 */
export const LayoutRenderer: React.FC<LayoutRendererProps> = ({
  layout,
  designProperties = [],
  properties = [],
  propertyValues = {},
  propertyMap = {},
  onUpdatePropertyValue,
}) => {
  return (
    <DesignPropertySchemasProvider properties={designProperties}>
      <DesignPropertiesProvider
        properties={properties}
        propertyValues={propertyValues}
        propertyMap={propertyMap}
        onUpdatePropertyValue={onUpdatePropertyValue}
      >
        <DesignRootElement element={layout.tree} />
      </DesignPropertiesProvider>
    </DesignPropertySchemasProvider>
  );
};
