import { useMemo } from 'react';
import { ContentViewType } from '@minddrop/content-views';
import { DragAndDrop } from '@minddrop/drag-and-drop';
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
  // Build the drag data for a content view element template
  const data = useMemo(
    () => ({
      [DesignElementTemplatesDataKey]: [
        {
          type: 'content-view',
          contentViewType: contentViewType.type,
          style: {},
        },
      ],
    }),
    [contentViewType.type],
  );
  // Register the item as draggable
  const { draggableProps } = DragAndDrop.useDraggable({
    id: `template-content-view-${contentViewType.type}`,
    type: DesignElementTemplatesDataKey,
    data,
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
