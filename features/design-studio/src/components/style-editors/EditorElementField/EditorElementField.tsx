import { useCallback } from 'react';
import { SwitchField } from '@minddrop/ui-primitives';
import {
  updateDesignElement,
  useDesignStudioStore,
} from '../../../DesignStudioStore';
import { FlatDesignElement } from '../../../types';

export interface EditorElementFieldProps {
  /**
   * The ID of the element to toggle editor mode on.
   */
  elementId: string;
}

/**
 * Renders a switch field for toggling an element's editor mode.
 */
export const EditorElementField: React.FC<EditorElementFieldProps> = ({
  elementId,
}) => {
  // Whether the element is in editor mode
  const isEditor = useDesignStudioStore(
    (state) =>
      (state.elements[elementId] as FlatDesignElement)?.editor || false,
  );

  // Toggle the element's editor mode
  const handleChange = useCallback(
    (checked: boolean) => {
      updateDesignElement(elementId, { editor: checked });
    },
    [elementId],
  );

  return (
    <SwitchField
      size="md"
      label="designs.editor.label"
      description="designs.editor.description"
      descriptionColor="subtle"
      checked={isEditor}
      onCheckedChange={handleChange}
    />
  );
};
