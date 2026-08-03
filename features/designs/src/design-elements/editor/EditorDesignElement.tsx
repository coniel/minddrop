import { useCallback } from 'react';
import {
  EditorElement,
  createEditorCssStyle,
  createEditorTitleCssStyle,
  elementTitleBindingId,
} from '@minddrop/designs';
import { MarkdownEditor } from '@minddrop/feature-markdown-editor';
import { useDesignPreview } from '../../DesignElements/DesignPreviewContext';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { useElementPlaceholder } from '../../useElementPlaceholder';
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
 * Renders a MarkdownEditor with the mapped property value and,
 * when a title property is bound, the mapped title as the
 * editor's title block. In preview mode, shows a non-interactive
 * overlay with a hover message.
 *
 * `emptyBehavior` does not apply to the title binding: the title
 * block always renders when bound, showing the editor's untitled
 * placeholder for unset values.
 */
export const EditorDesignElement: React.FC<EditorDesignElementProps> = ({
  element,
  rootProps,
}) => {
  const preview = useDesignPreview();
  const property = useElementProperty(element.id);
  const titleProperty = useElementProperty(elementTitleBindingId(element.id));
  // Sample title text shown in studio previews
  const titlePlaceholder = useElementPlaceholder({
    type: 'editor',
    property: element.titleProperty,
  });

  // Use the mapped property value if available
  const value = property?.value != null ? String(property.value) : undefined;

  // The bound title value, when set
  const boundTitle =
    titleProperty?.value != null ? String(titleProperty.value) : undefined;

  // The title passed to the editor
  const title = resolveTitle();

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

  // Commit title edits to the bound title property
  const handleTitleChange = useCallback(
    (newTitle: string) => {
      titleProperty?.updateValue(newTitle);
    },
    [titleProperty],
  );

  // Validate title edits against the bound title property
  const validateTitle = useCallback(
    (newTitle: string) => titleProperty?.validateValue(newTitle),
    [titleProperty],
  );

  /**
   * Resolves the title passed to the editor: undefined without a
   * title binding, sample placeholder text in previews, and the
   * bound value otherwise.
   */
  function resolveTitle(): string | undefined {
    // No title block without a title binding
    if (!element.titleProperty) {
      return undefined;
    }

    // Previews show the bound property's placeholder as sample text
    if (preview) {
      return titlePlaceholder;
    }

    // Unset values render the editor's own untitled placeholder
    return boundTitle ?? '';
  }

  return (
    <div
      {...rootProps}
      className="design-editor-element"
      style={mergedContainerStyle}
    >
      <MarkdownEditor
        initialValue={value}
        title={title}
        titleStyle={
          element.titleProperty
            ? createEditorTitleCssStyle(element.style)
            : undefined
        }
        onTitleChange={preview ? undefined : handleTitleChange}
        validateTitle={preview ? undefined : validateTitle}
        onDebouncedChange={preview ? undefined : handleChange}
        readOnly={preview}
        style={{
          ...editorStyle,
          ...(preview ? { pointerEvents: 'none' as const } : undefined),
        }}
      />
    </div>
  );
};
