import { useCallback } from 'react';
import { FormattedTextElement, createTextCssStyle } from '@minddrop/designs';
import { MarkdownEditor } from '@minddrop/feature-markdown-editor';
import { useElementProperty } from '../DesignPropertiesProvider';

export interface DesignFormattedTextElementProps {
  /**
   * The formatted text element to render.
   */
  element: FormattedTextElement;
}

/**
 * Display renderer for a formatted text design element.
 * When the element has editor mode enabled, renders a
 * MarkdownEditor for rich text editing. Otherwise shows
 * the mapped property value as static text.
 */
export const DesignFormattedTextElement: React.FC<
  DesignFormattedTextElementProps
> = ({ element }) => {
  const property = useElementProperty(element.id);

  // Update the mapped property value when the editor content changes
  const handleChange = useCallback(
    (value: string) => {
      property?.updateValue(value);
    },
    [property],
  );

  // Render a rich text editor when editor mode is enabled
  if (element.editor && property) {
    const initialValue =
      property.value != null ? String(property.value) : undefined;

    return (
      <div style={createTextCssStyle(element.style)}>
        <MarkdownEditor
          initialValue={initialValue}
          onDebouncedChange={handleChange}
        />
      </div>
    );
  }

  // Use the mapped property value if available, otherwise the placeholder
  const displayText =
    property?.value != null ? String(property.value) : element.placeholder;

  return <div style={createTextCssStyle(element.style)}>{displayText}</div>;
};
