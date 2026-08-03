import {
  Node,
  Range,
  Editor as SlateEditor,
  Element as SlateElement,
} from 'slate';
import { Ast } from '@minddrop/ast';
import { Transforms } from '../Transforms';
import { Editor } from '../types';
import { normalizePlainTextContent } from '../utils';
import { TITLE_ELEMENT_TYPE } from './TitleElement';
import { isSelectionInTitle, selectionSpansTitle } from './utils';

/**
 * Enforces the title feature's document structure: the editor's
 * first node is always a single plain text title element which
 * cannot be deleted, split, or merged with the content below it.
 *
 * Must be applied outermost so that its overrides run before
 * other plugins (e.g. withBlockReset would otherwise convert the
 * title into a paragraph).
 *
 * @param editor - An editor instance.
 * @returns The editor instance with the plugin behaviour applied.
 */
export function withTitle(editor: Editor): Editor {
  const {
    normalizeNode,
    insertBreak,
    insertSoftBreak,
    insertText,
    insertFragment,
    deleteBackward,
    deleteForward,
    deleteFragment,
  } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    // Enforce root level structure rules
    if (path.length === 0) {
      // Fix at most one issue per pass to avoid normalization loops
      if (normalizeRootNode(editor)) {
        return;
      }
    }

    // Convert title elements nested inside other elements into paragraphs
    if (
      path.length > 1 &&
      SlateElement.isElement(node) &&
      node.type === TITLE_ELEMENT_TYPE
    ) {
      Transforms.setNodes(editor, { type: 'paragraph' }, { at: path });

      return;
    }

    // Enforce plain text content rules on the title element
    if (
      path.length === 1 &&
      path[0] === 0 &&
      SlateElement.isElement(node) &&
      node.type === TITLE_ELEMENT_TYPE
    ) {
      // Fix at most one issue per pass to avoid normalization loops
      if (normalizePlainTextContent(editor, path)) {
        return;
      }
    }

    // Fall back to the wrapped normalization behaviour
    normalizeNode(entry);
  };

  editor.insertBreak = () => {
    // Outside the title, insert breaks as normal
    if (!isSelectionInTitle(editor)) {
      insertBreak();

      return;
    }

    // Delete the selected content before handling the break
    if (editor.selection && !Range.isCollapsed(editor.selection)) {
      editor.deleteFragment();
    }

    // Never split the title, move into the content instead
    moveCursorToContent(editor);
  };

  editor.insertSoftBreak = () => {
    // Outside the title, insert soft breaks as normal
    if (!isSelectionInTitle(editor)) {
      insertSoftBreak();

      return;
    }

    // Line breaks are not allowed in the title, move into the content
    moveCursorToContent(editor);
  };

  editor.insertText = (text, options) => {
    // Strip newlines from text inserted into the title
    if (isSelectionInTitle(editor) && text.includes('\n')) {
      insertText(text.replace(/\n/g, ' '), options);

      return;
    }

    insertText(text, options);
  };

  editor.insertFragment = (fragment, options) => {
    // Outside the title, insert fragments as normal
    if (!isSelectionInTitle(editor)) {
      insertFragment(fragment, options);

      return;
    }

    // Flatten the pasted fragment into plain text
    const plainText = fragment.map((node) => Node.string(node)).join(' ');

    editor.insertText(plainText);
  };

  editor.deleteBackward = (unit) => {
    const { selection } = editor;

    // Only handle collapsed selections
    if (!selection || !Range.isCollapsed(selection)) {
      deleteBackward(unit);

      return;
    }

    // At the start of the title, there is nothing to delete
    if (
      isSelectionInTitle(editor) &&
      SlateEditor.isStart(editor, selection.anchor, [0])
    ) {
      return;
    }

    // At the start of the first content block, prevent merging into the title
    if (
      selection.anchor.path[0] === 1 &&
      SlateEditor.isStart(editor, selection.anchor, [1])
    ) {
      const contentBlock = editor.children[1];

      // Whether the block is a non default type block
      const isNonDefaultBlock =
        SlateElement.isElement(contentBlock) &&
        contentBlock.type !== 'paragraph';

      // Delegate non default blocks so the wrapped block reset
      // behaviour resets them to a paragraph instead
      if (unit === 'character' && isNonDefaultBlock) {
        deleteBackward(unit);

        return;
      }

      // Remove the block entirely when it is an empty paragraph,
      // unless it is the only content block (one must always
      // remain below the title)
      if (
        SlateElement.isElement(contentBlock) &&
        contentBlock.type === 'paragraph' &&
        Node.string(contentBlock) === '' &&
        editor.children.length > 2
      ) {
        Transforms.removeNodes(editor, { at: [1] });
      }

      // Move the cursor to the end of the title
      Transforms.select(editor, SlateEditor.end(editor, [0]));

      return;
    }

    deleteBackward(unit);
  };

  editor.deleteForward = (unit) => {
    const { selection } = editor;

    // Only handle collapsed selections inside the title
    if (
      !selection ||
      !Range.isCollapsed(selection) ||
      !isSelectionInTitle(editor)
    ) {
      deleteForward(unit);

      return;
    }

    // Within the title text, delete as normal
    if (!SlateEditor.isEnd(editor, selection.anchor, [0])) {
      deleteForward(unit);

      return;
    }

    // At the end of the title, prevent merging the content into it
    if (editor.children.length > 1) {
      Transforms.select(editor, SlateEditor.start(editor, [1]));
    }
  };

  editor.deleteFragment = (options) => {
    const { selection } = editor;

    // Only handle selections spanning the title and content
    if (!selection || !selectionSpansTitle(editor)) {
      deleteFragment(options);

      return;
    }

    // Clamp the deletion to the content, leaving the title untouched
    const selectionEnd = Range.end(selection);
    const contentStart = SlateEditor.start(editor, [1]);

    Transforms.delete(editor, {
      at: { anchor: contentStart, focus: selectionEnd },
    });

    // Collapse the selection to the start of the content
    Transforms.select(editor, SlateEditor.start(editor, [1]));
  };

  return editor;
}

/**
 * Enforces the root level title structure rules, fixing at most
 * one issue. Returns whether a fix was applied.
 */
function normalizeRootNode(editor: Editor): boolean {
  // Find a stray title element below the first position
  const strayTitleIndex = editor.children.findIndex(
    (child, index) =>
      index > 0 &&
      SlateElement.isElement(child) &&
      child.type === TITLE_ELEMENT_TYPE,
  );

  // Convert the stray title element into a paragraph
  if (strayTitleIndex > 0) {
    Transforms.setNodes(
      editor,
      { type: 'paragraph' },
      { at: [strayTitleIndex] },
    );

    return true;
  }

  const firstChild = editor.children[0];

  // Whether the document starts with a title element
  const startsWithTitle =
    firstChild !== undefined &&
    SlateElement.isElement(firstChild) &&
    firstChild.type === TITLE_ELEMENT_TYPE;

  // Insert an empty title element when missing
  if (!startsWithTitle) {
    Transforms.insertNodes(editor, Ast.generateElement(TITLE_ELEMENT_TYPE), {
      at: [0],
    });

    return true;
  }

  // Insert an empty paragraph when the title is the only element
  if (editor.children.length === 1) {
    Transforms.insertNodes(editor, Ast.generateElement('paragraph'), {
      at: [1],
    });

    return true;
  }

  return false;
}

/**
 * Moves the cursor to the start of the first content block,
 * creating an empty paragraph when the title is the only node.
 */
function moveCursorToContent(editor: Editor): void {
  // Create an empty paragraph when there is no content below the title
  if (editor.children.length === 1) {
    Transforms.insertNodes(editor, Ast.generateElement('paragraph'), {
      at: [1],
    });
  }

  // Move the cursor to the start of the first content block
  Transforms.select(editor, SlateEditor.start(editor, [1]));
}
