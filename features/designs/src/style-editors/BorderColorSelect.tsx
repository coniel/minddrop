import { useCallback } from 'react';
import { ColorSelect } from '@minddrop/ui-primitives';
import { ContentColor } from '@minddrop/ui-theme';
import { updateElementStyle, useElementStyle } from '../DesignStudioStore';

export interface BorderColorSelectProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;

  /**
   * Optional i18n label key displayed above the select.
   */
  label?: string;
}

/**
 * Renders a color select for an element's border color.
 */
export const BorderColorSelect = ({
  elementId,
  label,
}: BorderColorSelectProps) => {
  const borderColor = useElementStyle(elementId, 'borderColor') as ContentColor;

  const handleChange = useCallback(
    (value: ContentColor) => {
      updateElementStyle(elementId, 'borderColor', value);
    },
    [elementId],
  );

  return (
    <ColorSelect
      size="md"
      variant="subtle"
      label={label}
      value={borderColor}
      valueColor={borderColor === 'default' ? 'muted' : 'regular'}
      onValueChange={handleChange}
    />
  );
};
