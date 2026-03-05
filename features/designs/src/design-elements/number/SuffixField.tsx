import { useCallback } from 'react';
import { NumberElement } from '@minddrop/designs';
import { FlexItem, Group, TextField } from '@minddrop/ui-primitives';
import { updateDesignElement, useElementData } from '../../DesignStudioStore';
import { FlatNumberElement } from '../../types';
import { FormatTextStylePopover } from '../formatted-text/FormatTextStylePopover';

export interface SuffixFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a text input and style popover for configuring the
 * suffix on a number design element.
 */
export const SuffixField = ({ elementId }: SuffixFieldProps) => {
  const { suffix } = useElementData(
    elementId,
    (element: FlatNumberElement) => ({
      suffix: element.format?.suffix ?? '',
    }),
  );

  const handleChange = useCallback(
    (value: string) => {
      updateDesignElement<NumberElement>(elementId, {
        format: { suffix: value },
      });
    },
    [elementId],
  );

  return (
    <Group gap={1}>
      <FlexItem grow={1} style={{ minWidth: 0 }}>
        <TextField
          variant="subtle"
          size="md"
          value={suffix}
          onValueChange={handleChange}
        />
      </FlexItem>
      <FormatTextStylePopover
        elementId={elementId}
        styleKey="suffixStyle"
        label="designs.number-format.suffix-style"
      />
    </Group>
  );
};
