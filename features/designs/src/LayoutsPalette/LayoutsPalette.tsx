import { DesignTypeLayoutTypes, LayoutType } from '@minddrop/designs';
import { useDraggable } from '@minddrop/selection';
import { useDesignStudioStore } from '../DesignStudioStore';
import { PaletteItem } from '../PaletteItem';
import {
  DesignLayoutTypesDataKey,
  layoutTypeDescriptionMap,
  layoutTypeIconMap,
  layoutTypeLabelMap,
} from '../constants';

/**
 * Renders the layout types the open design supports as a list of
 * draggable items, dropped onto the canvas to create a layout
 * where they land. Designs whose type has no layout types render
 * nothing.
 */
export const LayoutsPalette: React.FC = () => {
  const designType = useDesignStudioStore((state) => state.design?.type);

  // The layout types the design type supports
  const layoutTypes = designType ? DesignTypeLayoutTypes[designType] : [];

  // Design types with no layout types have nothing to offer
  if (layoutTypes.length === 0) {
    return null;
  }

  return (
    <>
      {layoutTypes.map((layoutType) => (
        <LayoutPaletteItem key={layoutType} layoutType={layoutType} />
      ))}
    </>
  );
};

interface LayoutPaletteItemProps {
  /**
   * The type of layout the item creates.
   */
  layoutType: LayoutType;
}

/**
 * Renders a draggable item for a single layout type.
 */
const LayoutPaletteItem: React.FC<LayoutPaletteItemProps> = ({
  layoutType,
}) => {
  const { draggableProps } = useDraggable({
    id: `layout-type-${layoutType}`,
    type: DesignLayoutTypesDataKey,
    data: { layoutType },
  });

  return (
    <PaletteItem
      icon={layoutTypeIconMap[layoutType]}
      label={layoutTypeLabelMap[layoutType]}
      description={layoutTypeDescriptionMap[layoutType]}
      draggableProps={draggableProps}
    />
  );
};
