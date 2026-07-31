import { useCallback } from 'react';
import { TextElement } from '@minddrop/designs';
import { TextField } from '@minddrop/ui-primitives';
import { updateDesignElement, useElementData } from '../DesignStudioStore';
import { FlatTextElement } from '../types';

export interface StaticContentFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a text field for editing a static element's content.
 */
export const StaticContentField: React.FC<StaticContentFieldProps> = ({
  elementId,
}) => {
  const { content } = useElementData(elementId, (element: FlatTextElement) => ({
    content: element.content || '',
  }));

  const handleChange = useCallback(
    (value: string) => {
      updateDesignElement<TextElement>(elementId, { content: value });
    },
    [elementId],
  );

  return (
    <TextField
      variant="subtle"
      size="md"
      value={content}
      onValueChange={handleChange}
      placeholder="designs.content.placeholder"
    />
  );
};
