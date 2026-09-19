import { useMemo } from 'react';
import { DesignElementConfig } from '@minddrop/designs';
import { DragAndDrop } from '@minddrop/drag-and-drop';
import { PaletteItem } from '../PaletteItem';
import { DesignElementTemplatesDataKey } from '../constants';

export interface ElementPaletteItemProps {
  /**
   * The config of the element type the item inserts.
   */
  config: DesignElementConfig;
}

/**
 * Renders a draggable palette item for an unstyled element type.
 */
export const ElementPaletteItem: React.FC<ElementPaletteItemProps> = ({
  config,
}) => {
  // Build the drag data for the element template
  const data = useMemo(
    () => ({ [DesignElementTemplatesDataKey]: [config.template] }),
    [config.template],
  );
  // Register the item as draggable
  const { draggableProps } = DragAndDrop.useDraggable({
    id: `template-${config.type}`,
    type: DesignElementTemplatesDataKey,
    data,
  });

  return (
    <PaletteItem
      icon={config.icon}
      label={config.label}
      compatiblePropertyTypes={config.compatiblePropertyTypes}
      draggableProps={draggableProps}
    />
  );
};
