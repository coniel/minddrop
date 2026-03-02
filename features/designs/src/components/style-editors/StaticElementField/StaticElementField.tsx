import { useCallback } from 'react';
import { SwitchField } from '@minddrop/ui-primitives';
import {
  updateDesignElement,
  useDesignStudioStore,
} from '../../../DesignStudioStore';
import { FlatDesignElement } from '../../../types';

export interface StaticElementFieldProps {
  /**
   * The ID of the element to toggle static mode on.
   */
  elementId: string;
}

/**
 * Renders a switch field for toggling an element's static mode.
 */
export const StaticElementField: React.FC<StaticElementFieldProps> = ({
  elementId,
}) => {
  // Whether the element is static
  const isStatic = useDesignStudioStore(
    (state) =>
      (state.elements[elementId] as FlatDesignElement)?.static || false,
  );

  // Toggle the element's static mode
  const handleChange = useCallback(
    (checked: boolean) => {
      updateDesignElement(elementId, { static: checked });
    },
    [elementId],
  );

  return (
    <SwitchField
      size="md"
      label="designs.static.label"
      description="designs.static.description"
      descriptionColor="subtle"
      checked={isStatic}
      onCheckedChange={handleChange}
    />
  );
};
