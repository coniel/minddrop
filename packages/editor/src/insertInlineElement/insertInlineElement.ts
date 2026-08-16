import { Range, Editor as SlateEditor } from 'slate';
import { Ast, Element } from '@minddrop/ast';
import { getEditorElementConfig } from '../EditorElementConfigs';
import { Transforms } from '../Transforms';
import { Editor } from '../types';
import { isInlineElement, isVoidElement } from '../utils';

/**
 * Inserts an inline element of the given type at the cursor, within the
 * block the cursor is in.
 *
 * Text the element is inserted over becomes its content, so that selecting
 * an expression and inserting inline math wraps it. The cursor is left at
 * the end of the element, ready to type into.
 *
 * @param editor An editor instance.
 * @param type The inline element type to insert.
 * @param data Element data applied over the element type's initial data.
 */
export function insertInlineElement<TElement extends Element = Element>(
  editor: Editor,
  type: string,
  data?: Partial<TElement>,
): void {
  const config = getEditorElementConfig(type);

  // Element types must have a component in order to be rendered, and an
  // inline element has nowhere to go without a cursor to put it at
  if (!config || !isInlineElement(type) || !editor.selection) {
    return;
  }

  const isCollapsed = Range.isCollapsed(editor.selection);
  const selectedText = SlateEditor.string(editor, editor.selection);

  // A void element holds no content of its own, so text it is inserted over
  // is replaced rather than taken in
  const takesContent = !isVoidElement(type) && !!selectedText;

  const element = {
    ...Ast.generateElement(type),
    ...(takesContent ? { children: [{ text: selectedText }] } : {}),
    ...data,
  } as Element;

  SlateEditor.withoutNormalizing(editor, () => {
    // The element takes the place of the text it is inserted over
    if (!isCollapsed) {
      Transforms.delete(editor);
    }

    Transforms.insertNodes(editor, element, { select: true });
    Transforms.collapse(editor, { edge: 'end' });
  });
}
