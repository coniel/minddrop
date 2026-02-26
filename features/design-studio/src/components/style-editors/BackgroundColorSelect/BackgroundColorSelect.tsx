import { useCallback } from 'react';
import {
  ColorSelect,
  ContentColor,
  FlexItem,
  Group,
} from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';
import { OpacityField } from '../OpacityField';

export interface BackgroundColorSelectProps {
  /**
   * The ID of the element for which to edit the background color.
   */
  elementId: string;
}

export const BackgroundColorSelect = ({
  elementId,
}: BackgroundColorSelectProps) => {
  const backgroundColor = useElementStyle(
    elementId,
    'backgroundColor',
  ) as ContentColor;

  const handleChange = useCallback(
    (value: ContentColor) => {
      updateElementStyle(elementId, 'backgroundColor', value);
    },
    [elementId],
  );

  return (
    <Group gap={2}>
      <FlexItem grow={2} style={{ flexBasis: 0, minWidth: 0 }}>
        <ColorSelect
          variant="subtle"
          value={backgroundColor}
          onValueChange={handleChange}
        />
      </FlexItem>
      <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
        <OpacityField elementId={elementId} />
      </FlexItem>
    </Group>
  );
};
