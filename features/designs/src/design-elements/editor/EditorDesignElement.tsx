import { useCallback, useRef } from 'react';
import {
  EditorElement,
  createEditorTitleCss,
  elementTitleBindingId,
  resolveElementStyle,
} from '@minddrop/designs';
import { MarkdownEditor } from '@minddrop/feature-markdown-editor';
import { useDesignPreview } from '../../DesignElements';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { useLayoutAutoFocus } from '../../LayoutAutoFocusContext';
import { useLayoutType } from '../../LayoutTypeContext';
import { useElementPlaceholder } from '../../useElementPlaceholder';
import './EditorDesignElement.css';
import { useElementCssStyle } from '../../useElementCssStyle';

export interface EditorDesignElementProps {
  /**
   * The editor element to render.
   */
  element: EditorElement;
}

/**
 * Display renderer for an editor design element.
 * Renders a MarkdownEditor with the mapped property value and,
 * when a title property is bound, the mapped title as the
 * editor's title block. In preview mode, the editor renders
 * read-only and non-interactive.
 *
 * The title block always renders when a title property is bound,
 * showing the editor's own untitled placeholder for unset values.
 */
export const EditorDesignElement: React.FC<EditorDesignElementProps> = ({
  element,
}) => {
  // Result of the one-time layout autofocus claim, null until
  // claimed on first render
  const autoFocusClaimRef = useRef<boolean | null>(null);

  const preview = useDesignPreview();
  const property = useElementProperty(element.id);
  const { claimAutoFocus } = useLayoutAutoFocus();

  // Claim the layout's editor autofocus on first render, so only
  // the first editor in the layout tree focuses
  if (autoFocusClaimRef.current === null) {
    autoFocusClaimRef.current = claimAutoFocus();
  }

  const titleProperty = useElementProperty(elementTitleBindingId(element.id));
  // Sample title text shown in studio previews
  const titlePlaceholder = useElementPlaceholder({
    type: 'editor',
    property: element.titleProperty,
  });

  // The surrounding layout's type, which role styles resolve against
  const layoutType = useLayoutType();
  // Resolve the element's style with its role styles applied
  const style = resolveElementStyle(element, layoutType ?? undefined);

  // Use the mapped property value if available
  const value = property?.value != null ? String(property.value) : undefined;

  // The bound title value, when set
  const boundTitle =
    titleProperty?.value != null ? String(titleProperty.value) : undefined;

  // The title passed to the editor
  const title = resolveTitle();

  const fullStyle = useElementCssStyle(element);

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
    <div className="designs-editor-element" style={containerStyle}>
      <MarkdownEditor
        initialValue={value}
        title={title}
        titleStyle={
          element.titleProperty ? createEditorTitleCss(style) : undefined
        }
        onTitleChange={preview ? undefined : handleTitleChange}
        validateTitle={preview ? undefined : validateTitle}
        onDebouncedChange={preview ? undefined : handleChange}
        autoFocus={autoFocusClaimRef.current}
        readOnly={preview}
        style={{
          ...editorStyle,
          ...(preview ? { pointerEvents: 'none' as const } : undefined),
        }}
      />
    </div>
  );
};
