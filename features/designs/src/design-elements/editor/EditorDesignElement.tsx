import { useCallback } from 'react';
import { EditorElement, createEditorCssStyle } from '@minddrop/designs';
import { MarkdownEditor } from '@minddrop/feature-markdown-editor';
import { useDesignPreview } from '../../DesignElements/DesignPreviewContext';
import { DesignPreviewOverlay } from '../../DesignElements/DesignPreviewOverlay';
import { useElementProperty } from '../../DesignPropertiesProvider';
import './EditorDesignElement.css';

export interface EditorDesignElementProps {
  /**
   * The editor element to render.
   */
  element: EditorElement;

  /**
   * Optional props to spread on the root DOM element.
   */
  rootProps?: Record<string, unknown>;
}

/**
 * Display renderer for an editor design element.
 * Renders a MarkdownEditor with the mapped property value.
 * In preview mode, shows a non-interactive overlay with a hover message.
 */
export const EditorDesignElement: React.FC<EditorDesignElementProps> = ({
  element,
  rootProps,
}) => {
  const preview = useDesignPreview();
  const property = useElementProperty(element.id);

  // Use the mapped property value if available
  const value = property?.value != null ? String(property.value) : undefined;

  const fullStyle = createEditorCssStyle(element.style);

  // Split padding from the container style so it is applied
  // to the inner editor element instead
  const {
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    ...containerStyle
  } = fullStyle;

  const editorStyle = { paddingTop, paddingRight, paddingBottom, paddingLeft };
  const rootStyle = rootProps?.style as React.CSSProperties | undefined;
  const mergedContainerStyle = { ...containerStyle, ...rootStyle };

  // Update the mapped property value when the editor content changes
  const handleChange = useCallback(
    (markdown: string) => {
      property?.updateValue(markdown);
    },
    [property],
  );

  // In preview mode, wrap with an overlay that blocks all
  // interaction and shows a message on hover
  if (preview) {
    return (
      <DesignPreviewOverlay
        {...rootProps}
        label="design-studio.elements.editor-preview-message"
        style={mergedContainerStyle}
      >
        <div className="design-editor-element">
          <MarkdownEditor initialValue={value} style={editorStyle} />
        </div>
      </DesignPreviewOverlay>
    );
  }

  return (
    <div
      {...rootProps}
      className="design-editor-element"
      style={mergedContainerStyle}
    >
      <MarkdownEditor
        initialValue={value}
        onDebouncedChange={handleChange}
        style={editorStyle}
      />
    </div>
  );
};
