import { useCallback } from 'react';
import { FlexItem, Group, TextField } from '@minddrop/ui-primitives';
import {
  updateDesignElement,
  useDesignStudioStore,
} from '../../../DesignStudioStore';
import { FlatNumberElement } from '../../../types';
import { FormatTextStylePopover } from '../FormatTextStylePopover';

export interface PrefixFieldProps {
  elementId: string;
}

export const PrefixField = ({ elementId }: PrefixFieldProps) => {
  const prefix = useDesignStudioStore(
    (state) =>
      (state.elements[elementId] as FlatNumberElement)?.format?.prefix ?? '',
  );

  const handleChange = useCallback(
    (value: string) => {
      updateDesignElement(elementId, {
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
