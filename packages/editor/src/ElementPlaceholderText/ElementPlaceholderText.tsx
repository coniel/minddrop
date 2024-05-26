import React from 'react';
import { Node, Range } from 'slate';
import { useSlate, useSelected, useFocused } from 'slate-react';
import { Element } from '../types';
import './ElementPlaceholderText.css';

export interface ElementPlaceholderTextProps {
  /**
   * The Element to render the placeholder text for.
   */
  element: Element;

  /**
   * The placeholder text.
   */
  text: string;

  /**
   * When `true`, the placeholder text is only
   * rendered when the element is focused.
   */
  onlyWhenFocused?: boolean;
}

export const ElementPlaceholderText: React.FC<ElementPlaceholderTextProps> = ({
  element,
  text,
  onlyWhenFocused,
}) => {
  const editor = useSlate();
  const selected = useSelected();
  const editorFocused = useFocused();

  const hasContent = element.children.length > 1 || Node.string(element);
  const isFocused =
    editorFocused &&
    selected &&
    editor.selection &&
    Range.isCollapsed(editor.selection);

  if (hasContent || (onlyWhenFocused && !isFocused)) {
    return null;
  }

  return (
    <span
      className="element-placeholder-text"
      contentEditable={false}
      style={{
        pointerEvents: 'none',
        userSelect: 'none',
        display: 'inline-block',
        width: 0,
        maxWidth: '100%',
        whiteSpace: 'nowrap',
        opacity: 0.25,
        position: 'absolute',
      }}
    >
      {text}
    </span>
  );
};
