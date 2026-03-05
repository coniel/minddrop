import { useCallback } from 'react';
import { NumberElement } from '@minddrop/designs';
import { FlexItem, Group, TextField } from '@minddrop/ui-primitives';
import { updateDesignElement, useElementData } from '../../DesignStudioStore';
import { FlatNumberElement } from '../../types';
import { FormatTextStylePopover } from '../formatted-text/FormatTextStylePopover';

export interface PrefixFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a text input and style popover for configuring the
 * prefix on a number design element.
 */
export const PrefixField = ({ elementId }: PrefixFieldProps) => {
  const { prefix } = useElementData(
    elementId,
    (element: FlatNumberElement) => ({
      prefix: element.format?.prefix ?? '',
    }),
  );

  const handleChange = useCallback(
    (value: string) => {
      updateDesignElement<NumberElement>(elementId, {
        format: { prefix: value },
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
          value={prefix}
          onValueChange={handleChange}
        />
      </FlexItem>
      <FormatTextStylePopover
        elementId={elementId}
        styleKey="prefixStyle"
        label="designs.number-format.prefix-style"
      />
    </Group>
  );
};
