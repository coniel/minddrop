import { useCallback } from 'react';
import { ColorSelect } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../DesignStudioStore';

export interface TextColorSelectProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;

  /**
   * Whether to show the inherit option.
   */
  showInherit?: boolean;
}

const inheritOption = {
  value: 'inherit',
  label: 'color.inherit',
  swatchClass: 'color-select-swatch-default',
};

/**
 * Renders a color select for an element's text color.
 */
export const TextColorSelect = ({
  elementId,
  showInherit = true,
}: TextColorSelectProps) => {
  const color = useElementStyle(elementId, 'color');

  const handleChange = useCallback(
    (value: string) => {
      updateElementStyle(elementId, 'color', value);
    },
    [elementId],
  );

  return (
    <ColorSelect
      size="md"
      variant="subtle"
      value={color}
      valueColor={color === 'inherit' ? 'muted' : 'regular'}
      onValueChange={handleChange}
      extraOptions={showInherit ? [inheritOption] : undefined}
    />
  );
};
