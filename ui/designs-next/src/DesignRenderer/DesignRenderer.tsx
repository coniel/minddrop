import { useMemo } from 'react';
import { Design, Designs } from '@minddrop/designs-next';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';
import { DesignPropertiesProvider } from '../DesignPropertiesProvider';
import './DesignRenderer.css';
import { LayoutBoxRenderer } from './LayoutBoxRenderer';

export interface DesignRendererProps {
  /**
   * The design to render.
   */
  design: Design;

  /**
   * The schemas of the properties the design's elements map to.
   * Needed alongside the values, which are read against their
   * schema.
   */
  properties?: PropertiesSchema;

  /**
   * The property values the design's mapped elements render, keyed
   * by property name.
   */
  values?: PropertyMap;
}

/**
 * Renders a design as a tree of flow boxes filling its container's
 * width.
 */
export const DesignRenderer: React.FC<DesignRendererProps> = ({
  design,
  properties,
  values,
}) => {
  // Compile the design once per design
  const tree = useMemo(() => Designs.resolveLayoutTree(design), [design]);

  return (
    <DesignPropertiesProvider properties={properties} values={values}>
      <div
        className="design-renderer"
        style={{ aspectRatio: design.aspectRatio }}
      >
        <LayoutBoxRenderer box={tree} design={design} axis={null} />
      </div>
    </DesignPropertiesProvider>
  );
};
