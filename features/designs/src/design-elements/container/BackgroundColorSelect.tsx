import { useCallback } from 'react';
import {
  ColorSelect,
  FlexItem,
  Group,
  InputLabel,
  Stack,
} from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';
import { OpacityField } from '../../style-editors/OpacityField';

export interface BackgroundColorSelectProps {
  /**
   * The ID of the element for which to edit the background color.
   */
  elementId: string;
}

const transparentOption = {
  value: 'transparent',
  label: 'color.transparent',
  swatchClass: 'color-select-swatch-transparent',
};

/**
 * Renders a color select and opacity field for configuring
 * the background color on a container element.
 */
export const BackgroundColorSelect = ({
  elementId,
}: BackgroundColorSelectProps) => {
  const backgroundColor = useElementStyle(elementId, 'backgroundColor');

  const handleChange = useCallback(
    (value: string) => {
      updateElementStyle(elementId, 'backgroundColor', value);
    },
    [elementId],
  );

  return (
    <Group gap={2}>
      <FlexItem grow={2} style={{ flexBasis: 0, minWidth: 0 }}>
        <ColorSelect
          size="md"
          variant="subtle"
          label="designs.background-color.color"
          value={backgroundColor}
          valueColor={backgroundColor === 'transparent' ? 'muted' : 'regular'}
          onValueChange={handleChange}
          extraOptions={[transparentOption]}
        />
      </FlexItem>
      <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
        <Stack gap={1}>
          <InputLabel size="xs" label="designs.background-color.opacity" />
          <OpacityField elementId={elementId} />
        </Stack>
      </FlexItem>
    </Group>
  );
};
