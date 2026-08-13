import { useCallback } from 'react';
import { IconElement } from '@minddrop/designs';
import {
  Button,
  ContentIcon,
  IconPicker,
  Stack,
} from '@minddrop/ui-primitives';
import {
  updateDesignElement,
  updateElementStyle,
  useElementData,
} from '../DesignStudioStore';
import { FlatIconElement } from '../types';

export interface IconContentFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders an icon preview and picker for editing a static icon
 * element's icon.
 */
export const IconContentField: React.FC<IconContentFieldProps> = ({
  elementId,
}) => {
  const { icon: iconString } = useElementData(
    elementId,
    (element: FlatIconElement) => ({
      icon: element.icon,
    }),
  );

  // Handles selecting an icon from the picker, syncing the
  // color from the icon string into the style color field
  const handleIconSelect = useCallback(
    (newIconString: string) => {
      updateDesignElement<IconElement>(elementId, { icon: newIconString });

      // Extract color from content-icon string (e.g. "content-icon:cat:cyan")
      const parts = newIconString.split(':');

      if (parts[0] === 'content-icon' && parts[2]) {
        updateElementStyle(elementId, 'color', parts[2]);
      }
    },
    [elementId],
  );

  // Handles clearing the icon
  const handleIconClear = useCallback(() => {
    updateDesignElement<IconElement>(elementId, { icon: '' });
  }, [elementId]);

  return (
    <Stack gap={2} style={{ alignItems: 'center' }}>
      <div
        style={{
          ['--icon-size-md' as string]: '40px',
          fontSize: '40px',
          lineHeight: 1,
          display: 'inline-flex',
        }}
      >
        <ContentIcon
          icon={iconString?.replace(
            /content-icon:([^:]+):.*/,
            'content-icon:$1:default',
          )}
        />
      </div>
      <IconPicker
        currentIcon={iconString}
        onSelect={handleIconSelect}
        onClear={handleIconClear}
        closeOnSelect
      >
        <Button variant="subtle" size="sm" label="designs.icon.change" />
      </IconPicker>
    </Stack>
  );
};
