import { PropertyElementConfig } from '@minddrop/designs';
import { useDraggable } from '@minddrop/selection';
import { PaletteItem } from '../PaletteItem';
import { DesignPropertyElementsDataKey } from '../constants';

export interface PropertyElementPaletteItemProps {
  /**
   * The property element config the item inserts.
   */
  config: PropertyElementConfig;
}

/**
 * Renders a draggable palette item for a property element. Dropping
 * it inserts an element for the property type, auto-bound to a
 * compatible design property.
 */
export const PropertyElementPaletteItem: React.FC<
  PropertyElementPaletteItemProps
> = ({ config }) => {
  const { draggableProps } = useDraggable({
    id: `property-element-${config.propertyType}`,
    type: DesignPropertyElementsDataKey,
    data: { propertyType: config.propertyType },
  });

  return (
    <PaletteItem
      icon={config.icon}
      label={config.label}
      compatiblePropertyTypes={config.bindsPropertyTypes}
      draggableProps={draggableProps}
    />
  );
};
