import { Design } from '@minddrop/designs';
import { DesignRootElement } from './DesignElements';
import {
  DesignPropertiesProvider,
  DesignPropertiesProviderProps,
} from './DesignPropertiesProvider';

export interface DesignRendererProps
  extends Pick<
    DesignPropertiesProviderProps,
    'onUpdatePropertyValue' | 'properties' | 'propertyValues' | 'propertyMap'
  > {
  /**
   * The design to render.
   */
  design: Design;
}

/**
 * Renders a design with real property values bound via propertyMap.
 * Wraps the design tree in a DesignPropertiesProvider so that
 * child element renderers can access mapped property data.
 */
export const DesignRenderer: React.FC<DesignRendererProps> = ({
  design,
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
      <DesignRootElement element={design.tree} />
    </DesignPropertiesProvider>
  );
};
