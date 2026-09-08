import { DesignElementConfig, Designs } from '@minddrop/designs-next';
import { Selection } from '@minddrop/selection';
import { useHoveredItem } from '@minddrop/ui-drag-and-drop';
import { Icon, Text, usePressedState } from '@minddrop/ui-primitives';
import './ElementsPaletteItem.css';

export interface ElementsPaletteItemProps {
  /**
   * The config of the element type the item inserts.
   */
  config: DesignElementConfig;
}

/**
 * Renders a palette item which drags its element type onto the
 * design.
 */
export const ElementsPaletteItem: React.FC<ElementsPaletteItemProps> = ({
  config,
}) => {
  const { draggableProps } = Selection.useDraggable({
    id: `element-type-${config.type}`,
    type: Designs.constants.ElementTypesDataKey,
    data: { type: config.type },
  });
  const { pressedProps } = usePressedState();
  // Items track hover themselves, since a native drag leaves browser
  // hover state stuck on the item it started from.
  const { hoveredProps } = useHoveredItem(`palette:${config.type}`);

  return (
    <div
      className="designs-next-palette-item"
      {...hoveredProps}
      {...pressedProps}
      {...draggableProps}
    >
      <Icon name={config.icon} className="designs-next-palette-item-icon" />
      <Text size="sm" text={config.label} />
    </div>
  );
};
