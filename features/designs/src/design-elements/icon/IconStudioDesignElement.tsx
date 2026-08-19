import { useCallback, useMemo, useRef, useState } from 'react';
import { IconElement } from '@minddrop/designs';
import { IconPicker } from '@minddrop/ui-primitives';
import { StudioLeafElement } from '../../DesignStudioElement';
import { useDesignStudio } from '../../DesignStudioStore';
import { FlatIconElement } from '../../types';
import { IconDesignElement } from './IconDesignElement';

export interface IconStudioDesignElementProps {
  /**
   * The icon element to render in the studio.
   */
  element: FlatIconElement;

  /**
   * Props to spread on the outermost DOM element for
   * drag-and-drop and click-to-select behaviour.
   */
  rootProps: Record<string, unknown>;
}

/**
 * Renders an icon element in the design studio.
 * Opens an IconPicker on double-click for interactive
 * icon selection.
 */
export const IconStudioDesignElement: React.FC<
  IconStudioDesignElementProps
> = ({ element, rootProps }) => {
  const studio = useDesignStudio();
  const [pickerOpen, setPickerOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  // Handles selecting an icon from the picker
  const handleSelect = useCallback(
    (iconString: string) => {
      studio.updateDesignElement<IconElement>(element.id, { icon: iconString });
    },
    [studio, element.id],
  );

  // Open the icon picker on double-click
  const handleDoubleClick = useCallback(() => {
    setPickerOpen(true);
  }, []);

  // Only allow the popover to close, not open via trigger click.
  // Opening is handled exclusively by double-click.
  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (!nextOpen) {
      setPickerOpen(false);
    }
  }, []);

  // Merge the double-click handler into rootProps
  const mergedRootProps = useMemo(
    () => ({ ...rootProps, onDoubleClick: handleDoubleClick }),
    [rootProps, handleDoubleClick],
  );

  return (
    <IconPicker
      currentIcon={element.icon}
      onSelect={handleSelect}
      open={pickerOpen}
      onOpenChange={handleOpenChange}
      anchor={anchorRef}
      closeOnSelect
    >
      <StudioLeafElement
        element={element}
        rootProps={mergedRootProps}
        wrapperRef={anchorRef}
      >
        <IconDesignElement element={element} />
      </StudioLeafElement>
    </IconPicker>
  );
};
