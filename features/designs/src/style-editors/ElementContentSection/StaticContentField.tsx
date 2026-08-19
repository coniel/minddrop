import { useCallback } from 'react';
import { TextElement } from '@minddrop/designs';
import { TextField } from '@minddrop/ui-primitives';
import { useDesignStudio, useElementData } from '../../DesignStudioStore';
import { FlatTextElement } from '../../types';

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
  const studio = useDesignStudio();
  const { content } = useElementData(elementId, (element: FlatTextElement) => ({
    content: element.content || '',
  }));

  const handleChange = useCallback(
    (value: string) => {
      studio.updateDesignElement<TextElement>(elementId, { content: value });
    },
    [studio, elementId],
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
