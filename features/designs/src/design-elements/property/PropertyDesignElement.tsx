import {
  PropertyElement,
  getPropertyElementConfig,
  getPropertyElementVariant,
} from '@minddrop/designs';
import { propertyRendererMap } from './propertyRendererMap';

export interface PropertyDesignElementProps {
  /**
   * The property element to render.
   */
  element: PropertyElement;
}

/**
 * Renders a property element through the renderer its selected
 * presentation variant declares. Renders nothing when the property
 * type has no config or the renderer is unknown.
 */
export const PropertyDesignElement: React.FC<PropertyDesignElementProps> = ({
  element,
}) => {
  // Look up the element's property element config
  const config = getPropertyElementConfig(element.propertyType, false);

  // A property type without a config has nothing to render through
  if (!config) {
    return null;
  }

  // The selected presentation variant decides the renderer
  const variant = getPropertyElementVariant(config, element.variant);
  const Renderer = propertyRendererMap[variant.renderer];

  // Guard against renderer keys without a component
  if (!Renderer) {
    return null;
  }

  return <Renderer element={element} />;
};
