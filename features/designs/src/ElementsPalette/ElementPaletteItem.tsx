import { DesignElementConfig } from '@minddrop/designs';
import { useDraggable } from '@minddrop/selection';
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
  const { draggableProps } = useDraggable({
    id: `template-${config.type}`,
    type: DesignElementTemplatesDataKey,
    data: config.template,
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
