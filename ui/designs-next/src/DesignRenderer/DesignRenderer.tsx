import { useMemo } from 'react';
import { Design, Designs } from '@minddrop/designs-next';
import {
  PropertiesSchema,
  PropertyMap,
  PropertyValue,
} from '@minddrop/properties';
import { DesignPropertiesProvider } from '../DesignPropertiesProvider';
import { resolveDesignStyle } from '../utils';
import './DesignRenderer.css';
import { LayoutBoxRenderer } from './LayoutBoxRenderer';

export interface DesignRendererProps {
  /**
   * The design to render.
   */
  design: Design;

  /**
   * The schemas of the properties the design's elements map to.
   * Needed alongside the values. They are read against their
   * schema.
   */
  properties?: PropertiesSchema;

  /**
   * The property values the design's mapped elements render, keyed
   * by property name.
   */
  values?: PropertyMap;

  /**
   * Called with a property's name and new value when a mapped
   * element changes it. Omit to render the design read only.
   */
  onValueChange?: (name: string, value: PropertyValue) => void;

  /**
   * Validates a property's new value before a mapped element
   * commits it. Returns a translated error message when it is
   * invalid.
   */
  validateValue?: (name: string, value: PropertyValue) => string | undefined;
}

/**
 * Renders a design as a tree of flow boxes filling its container's
 * width.
 */
export const DesignRenderer: React.FC<DesignRendererProps> = ({
  design,
  properties,
  values,
  onValueChange,
  validateValue,
}) => {
  // Compile the design once per design
  const tree = useMemo(() => Designs.resolveLayoutTree(design), [design]);

  return (
    <DesignPropertiesProvider
      properties={properties}
      values={values}
      onValueChange={onValueChange}
      validateValue={validateValue}
    >
      <div className="design-renderer" style={resolveDesignStyle(design)}>
        <LayoutBoxRenderer box={tree} design={design} axis={null} />
      </div>
    </DesignPropertiesProvider>
  );
};
