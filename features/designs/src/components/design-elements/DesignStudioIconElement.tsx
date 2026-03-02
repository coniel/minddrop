import { useCallback } from 'react';
import { IconPicker } from '@minddrop/ui-primitives';
import { DesignIconElement } from '../../DesignElements';
import {
  updateDesignElement,
  updateElementStyle,
} from '../../DesignStudioStore';
import { FlatIconElement } from '../../types';

export interface DesignStudioIconElementProps {
  element: FlatIconElement;
}

/**
 * Renders an icon element in the design studio.
 * Wraps DesignIconElement inside an IconPicker for
 * interactive icon selection and color syncing.
 */
export const DesignStudioIconElement: React.FC<
  DesignStudioIconElementProps
> = ({ element }) => {
  // Handles selecting an icon from the picker, syncing the
  // color from the icon string into the style color field
  const handleSelect = useCallback(
    (iconString: string) => {
      updateDesignElement(element.id, { icon: iconString });

      // Extract color from content-icon string (e.g. "content-icon:cat:cyan")
      const parts = iconString.split(':');

      if (parts[0] === 'content-icon' && parts[2]) {
        updateElementStyle(element.id, 'color', parts[2]);
      }
    },
    [element.id],
  );

  return (
    <IconPicker
      currentIcon={element.icon}
      onSelect={handleSelect}
      closeOnSelect
    >
      <div>
        <DesignIconElement element={element} />
      </div>
    </IconPicker>
  );
};
