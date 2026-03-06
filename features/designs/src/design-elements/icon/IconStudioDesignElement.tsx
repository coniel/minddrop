import { useCallback, useMemo, useRef, useState } from 'react';
import { IconElement } from '@minddrop/designs';
import { IconPicker } from '@minddrop/ui-primitives';
import {
  updateDesignElement,
  updateElementStyle,
} from '../../DesignStudioStore';
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
 * icon selection and color syncing.
 */
export const IconStudioDesignElement: React.FC<
  IconStudioDesignElementProps
> = ({ element, rootProps }) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  // Handles selecting an icon from the picker, syncing the
  // color from the icon string into the style color field
  const handleSelect = useCallback(
    (iconString: string) => {
      updateDesignElement<IconElement>(element.id, { icon: iconString });

      // Extract color from content-icon string (e.g. "content-icon:cat:cyan")
      const parts = iconString.split(':');

      if (parts[0] === 'content-icon' && parts[2]) {
        updateElementStyle(element.id, 'color', parts[2]);
      }
    },
    [element.id],
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

  // Merge double-click handler and anchor ref into rootProps
  const mergedRootProps = useMemo(
    () => ({ ...rootProps, onDoubleClick: handleDoubleClick, ref: anchorRef }),
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
      <IconDesignElement element={element} rootProps={mergedRootProps} />
    </IconPicker>
  );
};
