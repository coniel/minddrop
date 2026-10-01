import { Path, Editor as SlateEditor } from 'slate';
import {
  Ast,
  Element,
  ParagraphElement,
  generateBlockquoteFrame,
  generateWikilinkElement,
} from '@minddrop/ast';
import { Transforms } from '../Transforms';
import { Editor } from '../types';
import { resolveBlockInsertionPath } from '../utils';

/**
 * Inserts a quote block containing a wikilink below the block the
 * cursor is in, or at the end of the document when there is no
 * cursor. An empty paragraph follows the quote and takes the cursor.
 *
 * @param editor - An editor instance.
 * @param reference - What the link points at, as written between its brackets.
 * @param label - The link's text, the quoted passage.
 * @param fragment - The part of the target the link points into.
 */
export function insertReferenceQuote(
  editor: Editor,
  reference: string,
  label: string,
  fragment?: string,
): void {
  // Create the link
  const link = generateWikilinkElement(reference, { label, fragment });

  // Build the quote
  const quote: ParagraphElement = {
    // The paragraph holding the link
    ...Ast.generateElement<ParagraphElement>('paragraph'),
    // The block quote frame
    ancestry: [generateBlockquoteFrame()],
    // The link, with empty text on either side so that the cursor can
    // stand there.
    children: [{ text: '' }, link, { text: '' }],
  };

  // Create the paragraph the cursor continues in after the quote
  const trailing = Ast.generateElement<ParagraphElement>('paragraph');

  // Resolve where the quote goes
  const at = resolveBlockInsertionPath(editor);

  // Insert and select in one normalization pass
  SlateEditor.withoutNormalizing(editor, () => {
    // Insert the quote and the trailing paragraph
    Transforms.insertNodes(editor, [quote, trailing] as Element[], { at });

    // Place the cursor in the trailing paragraph
    Transforms.select(editor, SlateEditor.start(editor, Path.next(at)));
  });
}
