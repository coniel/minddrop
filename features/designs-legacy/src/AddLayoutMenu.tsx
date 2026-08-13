import { useCallback } from 'react';
import { LayoutType } from '@minddrop/designs-legacy';
import {
  DropdownMenu,
  DropdownMenuItem,
  IconButton,
  MenuGroup,
  MenuLabel,
} from '@minddrop/ui-primitives';
import { DesignStudioStore, addLayout } from './DesignStudioStore';
import { layoutTypeIconMap } from './constants';
import { designStudioCanvasStore } from './designStudioCanvas';
import { getNewLayoutPosition } from './utils';

/**
 * Renders a + icon button that opens a dropdown menu for adding a
 * layout to the design open in the studio.
 */
export const AddLayoutMenu: React.FC = () => {
  // Add a layout of the given type to the open design, placed to
  // the right of its existing frames, and center the view on it
  const handleAddLayout = useCallback(async (type: LayoutType) => {
    const design = DesignStudioStore.getDesign();

    if (!design) {
      return;
    }

    const layout = await addLayout(
      design.id,
      type,
      getNewLayoutPosition(design.layouts),
    );

    // Center the view on the new layout's frame, which is known
    // from data before the frame has rendered
    designStudioCanvasStore.centerOnFrame({
      x: layout.frame.x,
      y: layout.frame.y,
      width: layout.frame.width,
      height: layout.frame.height ?? 0,
    });
  }, []);

  return (
    <DropdownMenu
      trigger={
        <IconButton size="sm" label="designs.layouts.labels.add" icon="plus" />
      }
    >
      <MenuGroup>
        <MenuLabel label="designs.layouts.labels.add" />
        <DropdownMenuItem
          muted
          icon={layoutTypeIconMap.card}
          label="designs.layouts.card.label"
          tooltip={{ description: 'designs.layouts.card.description' }}
          onSelect={() => handleAddLayout('card')}
        />
        <DropdownMenuItem
          muted
          icon={layoutTypeIconMap.list}
          label="designs.layouts.list.label"
          tooltip={{ description: 'designs.layouts.list.description' }}
          onSelect={() => handleAddLayout('list')}
        />
        <DropdownMenuItem
          muted
          icon={layoutTypeIconMap.page}
          label="designs.layouts.page.label"
          tooltip={{ description: 'designs.layouts.page.description' }}
          onSelect={() => handleAddLayout('page')}
        />
      </MenuGroup>
    </DropdownMenu>
  );
};
