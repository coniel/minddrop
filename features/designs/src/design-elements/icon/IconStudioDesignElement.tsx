import { useCallback } from 'react';
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
}

/**
 * Renders an icon element in the design studio.
 * Wraps IconDesignElement inside an IconPicker for
 * interactive icon selection and color syncing.
 */
export const IconStudioDesignElement: React.FC<
  IconStudioDesignElementProps
> = ({ element }) => {
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

  return (
    <IconPicker
      currentIcon={element.icon}
      onSelect={handleSelect}
      closeOnSelect
    >
      <div>
        <IconDesignElement element={element} />
      </div>
    </IconPicker>
  );
};
