import { useCallback } from 'react';
import { NumberField } from '@minddrop/ui-primitives';
import {
  updateDesignElement,
  useDesignStudioStore,
} from '../../../DesignStudioStore';
import { FlatNumberElement } from '../../../types';

export interface DecimalPlacesFieldProps {
  elementId: string;
}

export const DecimalPlacesField = ({
  elementId,
}: DecimalPlacesFieldProps) => {
  const decimals = useDesignStudioStore(
    (state) =>
      (state.elements[elementId] as FlatNumberElement)?.format?.decimals ?? 0,
  );

  const handleChange = useCallback(
    (value: number | null) => {
      updateDesignElement(elementId, {
        format: { decimals: value ?? 0 },
      });
    },
    [elementId],
  );

  return (
    <NumberField
      variant="subtle"
      size="md"
      value={decimals || null}
      onValueChange={handleChange}
      min={1}
      max={10}
      step={1}
      clearable
      placeholder="designs.number-format.decimals.placeholder"
    />
  );
};
