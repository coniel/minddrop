import { DefaultViewElementStyle } from '@minddrop/designs';
import { useDraggable } from '@minddrop/selection';
import { UiIconName } from '@minddrop/ui-icons';
import { Icon, Text } from '@minddrop/ui-primitives';
import { DataView, DataViewTypes } from '@minddrop/views';
import { DesignElementTemplatesDataKey } from '../constants';

export interface ViewPaletteItemProps {
  /**
   * The existing view to render a palette item for.
   */
  view: DataView;
}

/**
 * Renders a draggable palette item inserting a static view
 * element configured to an existing view.
 */
export const ViewPaletteItem: React.FC<ViewPaletteItemProps> = ({ view }) => {
  const viewType = DataViewTypes.use(view.type);

  // Build a static view element template referencing the view
  const template = {
    type: 'view' as const,
    viewType: view.type,
    static: true,
    content: view.id,
    style: { ...DefaultViewElementStyle },
  };

  const { draggableProps } = useDraggable({
    id: `template-view-${view.id}`,
    type: DesignElementTemplatesDataKey,
    data: template,
  });

  return (
    <div className="elements-palette-item" {...draggableProps}>
      <Icon
        name={(viewType?.icon as UiIconName) || 'app-window'}
        className="elements-palette-item-icon"
      />
      <Text size="sm">{view.name}</Text>
    </div>
  );
};
