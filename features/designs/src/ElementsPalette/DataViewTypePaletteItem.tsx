import { DataViewType } from '@minddrop/data-views';
import { useDraggable } from '@minddrop/selection';
import { PaletteItem } from '../PaletteItem';
import { DesignElementTemplatesDataKey } from '../constants';

export interface DataViewTypePaletteItemProps {
  /**
   * The data view type the item inserts an element for.
   */
  dataViewType: DataViewType;
}

/**
 * Renders a draggable palette item inserting a data view element
 * rendering as the given data view type.
 */
export const DataViewTypePaletteItem: React.FC<
  DataViewTypePaletteItemProps
> = ({ dataViewType }) => {
  const { draggableProps } = useDraggable({
    id: `template-data-view-${dataViewType.type}`,
    type: DesignElementTemplatesDataKey,
    data: { type: 'data-view', dataViewType: dataViewType.type, style: {} },
  });

  return (
    <PaletteItem
      icon={dataViewType.icon}
      label={dataViewType.name}
      description={dataViewType.description}
      draggableProps={draggableProps}
    />
  );
};
