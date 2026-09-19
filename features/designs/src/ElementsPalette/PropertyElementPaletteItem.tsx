import { useMemo } from 'react';
import { PropertyElementConfig } from '@minddrop/designs';
import { DragAndDrop } from '@minddrop/drag-and-drop';
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
  // Build the drag data for the property element
  const data = useMemo(
    () => ({
      [DesignPropertyElementsDataKey]: [{ propertyType: config.propertyType }],
    }),
    [config.propertyType],
  );
  // Register the item as draggable
  const { draggableProps } = DragAndDrop.useDraggable({
    id: `property-element-${config.propertyType}`,
    type: DesignPropertyElementsDataKey,
    data,
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
