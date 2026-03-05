import { useCallback } from 'react';
import { NumberElement } from '@minddrop/designs';
import { NumberField } from '@minddrop/ui-primitives';
import { updateDesignElement, useElementData } from '../../DesignStudioStore';
import { FlatNumberElement } from '../../types';

export interface DecimalPlacesFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a number input for configuring the decimal places
 * on a number design element.
 */
export const DecimalPlacesField = ({ elementId }: DecimalPlacesFieldProps) => {
  const { decimals } = useElementData(
    elementId,
    (element: FlatNumberElement) => ({
      decimals: element.format?.decimals ?? 0,
    }),
  );

  const handleChange = useCallback(
    (value: number | null) => {
      updateDesignElement<NumberElement>(elementId, {
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
