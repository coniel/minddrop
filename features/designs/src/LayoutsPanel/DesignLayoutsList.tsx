import { useCallback } from 'react';
import { Layout } from '@minddrop/designs';
import { MenuItem, Text } from '@minddrop/ui-primitives';
import { useDesignStudio, useDesignStudioStore } from '../DesignStudioStore';
import { layoutTypeIconMap } from '../constants';

/**
 * Renders the design's layouts as a list of menu items, opening
 * the clicked layout for editing.
 */
export const DesignLayoutsList: React.FC = () => {
  const layouts = useDesignStudioStore((state) => state.design?.layouts);

  // Designs with no layouts say so rather than rendering an empty
  // list
  if (!layouts || layouts.length === 0) {
    return (
      <Text
        block
        size="sm"
        color="subtle"
        className="designs-layouts-panel-empty"
        text="designs.layouts.empty"
      />
    );
  }

  return (
    <>
      {layouts.map((layout) => (
        <DesignLayoutItem key={layout.id} layout={layout} />
      ))}
    </>
  );
};

interface DesignLayoutItemProps {
  /**
   * The layout the item opens.
   */
  layout: Layout;
}

/**
 * Renders a single layout in the design's layouts list.
 */
const DesignLayoutItem: React.FC<DesignLayoutItemProps> = ({ layout }) => {
  const studio = useDesignStudio();

  // Open the layout for editing, switching the panel to its tree
  const handleClick = useCallback(() => {
    studio.setActiveLayout(layout.id);
  }, [studio, layout.id]);

  return (
    <MenuItem
      size="compact"
      icon={layoutTypeIconMap[layout.type]}
      stringLabel={layout.name}
      onClick={handleClick}
    />
  );
};
