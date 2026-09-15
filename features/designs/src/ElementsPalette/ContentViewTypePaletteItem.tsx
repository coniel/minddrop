import { ContentViewType } from '@minddrop/content-views';
import { Selection } from '@minddrop/selection';
import { Icons } from '@minddrop/ui-icons';
import { PaletteItem } from '../PaletteItem';
import { DesignElementTemplatesDataKey } from '../constants';

export interface ContentViewTypePaletteItemProps {
  /**
   * The content view type the item inserts an element for.
   */
  contentViewType: ContentViewType;
}

/**
 * Renders a draggable palette item inserting a content view element
 * rendering as the given content view type.
 */
export const ContentViewTypePaletteItem: React.FC<
  ContentViewTypePaletteItemProps
> = ({ contentViewType }) => {
  const { draggableProps } = Selection.useDraggable({
    id: `template-content-view-${contentViewType.type}`,
    type: DesignElementTemplatesDataKey,
    data: {
      type: 'content-view',
      contentViewType: contentViewType.type,
      style: {},
    },
  });

  return (
    <PaletteItem
      contentIcon={Icons.fromName(contentViewType.icon)}
      label={contentViewType.name}
      description={contentViewType.description}
      draggableProps={draggableProps}
    />
  );
};
