import { Editor as SlateEditor, Transforms } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import {
  Ast,
  Element,
  LinkElement,
  ParagraphElement,
  WikilinkElement,
} from '@minddrop/ast';
import { cleanup, createTestEditor } from '../../test-utils';
import { Editor } from '../../types';
import { resolveLinkAtCursor } from './resolveLinkAtCursor';

// Creates an editor holding a paragraph with the given inline element
// between two runs of text
function createEditorWithInline(inline: Element): Editor {
  return createTestEditor([
    Ast.generateElement<ParagraphElement>('paragraph', {
      children: [{ text: 'Go to ' }, inline, { text: ' now' }],
    }),
  ]);
}

const link = Ast.generateElement<LinkElement>('link', {
  url: 'https://minddrop.app',
  children: [{ text: 'MindDrop' }],
});

const wikilink = Ast.generateElement<WikilinkElement>('wikilink', {
  reference: 'Book',
  children: [{ text: 'Book' }],
});

describe('resolveLinkAtCursor', () => {
  afterEach(cleanup);

  it('returns the link the cursor is within', () => {
    const editor = createEditorWithInline(link);

    // Place the cursor inside the link's text
    Transforms.select(editor, SlateEditor.end(editor, [0, 1]));

    expect(resolveLinkAtCursor(editor)).toMatchObject({
      type: 'link',
      url: 'https://minddrop.app',
    });
  });

  it('returns the wikilink the cursor is within', () => {
    const editor = createEditorWithInline(wikilink);

    Transforms.select(editor, SlateEditor.end(editor, [0, 1]));

    expect(resolveLinkAtCursor(editor)).toMatchObject({
      type: 'wikilink',
      reference: 'Book',
    });
  });

  it('returns null when the cursor is outside the link', () => {
    const editor = createEditorWithInline(link);

    // Place the cursor in the text before the link
    Transforms.select(editor, SlateEditor.start(editor, [0]));

    expect(resolveLinkAtCursor(editor)).toBeNull();
  });

  it('returns null when there is no cursor', () => {
    const editor = createEditorWithInline(link);

    Transforms.deselect(editor);

    expect(resolveLinkAtCursor(editor)).toBeNull();
  });
});
