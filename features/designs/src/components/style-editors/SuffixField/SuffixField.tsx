import { useCallback } from 'react';
import { FlexItem, Group, TextField } from '@minddrop/ui-primitives';
import {
  updateDesignElement,
  useDesignStudioStore,
} from '../../../DesignStudioStore';
import { FlatNumberElement } from '../../../types';
import { FormatTextStylePopover } from '../FormatTextStylePopover';

export interface SuffixFieldProps {
  elementId: string;
}

export const SuffixField = ({ elementId }: SuffixFieldProps) => {
  const suffix = useDesignStudioStore(
    (state) =>
      (state.elements[elementId] as FlatNumberElement)?.format?.suffix ?? '',
  );

  const handleChange = useCallback(
    (value: string) => {
      updateDesignElement(elementId, {
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
