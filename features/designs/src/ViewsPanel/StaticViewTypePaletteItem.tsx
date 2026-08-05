import { DataViewType } from '@minddrop/data-views';
import { DefaultViewElementStyle } from '@minddrop/designs';
import { useDraggable } from '@minddrop/selection';
import { UiIconName } from '@minddrop/ui-icons';
import { Icon, Text } from '@minddrop/ui-primitives';
import { DesignElementTemplatesDataKey } from '../constants';

export interface StaticViewTypePaletteItemProps {
  /**
   * The registered view type to render a palette item for.
   */
  viewType: DataViewType;
}

/**
 * Renders a draggable palette item creating a static view element
 * of the given view type. The dropped element renders a view
 * creation form until a view is created for it.
 */
export const StaticViewTypePaletteItem: React.FC<
  StaticViewTypePaletteItemProps
> = ({ viewType }) => {
  // Build a static view element template with this view type
  const template = {
    type: 'view' as const,
    viewType: viewType.type,
    static: true,
    style: { ...DefaultViewElementStyle },
  };

  const { draggableProps } = useDraggable({
    id: `template-static-view-${viewType.type}`,
    type: DesignElementTemplatesDataKey,
    data: template,
  });

  return (
    <div className="elements-palette-item" {...draggableProps}>
      <Icon
        name={(viewType.icon as UiIconName) || 'app-window'}
        className="elements-palette-item-icon"
      />
      <Text size="sm" text={viewType.name} />
    </div>
  );
};
