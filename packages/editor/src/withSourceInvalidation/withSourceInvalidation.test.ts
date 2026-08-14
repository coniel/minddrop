import { Transforms } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { Ast, Element, ParagraphElement } from '@minddrop/ast';
import { cleanup, createTestEditor } from '../test-utils';
import { withSourceInvalidation } from './withSourceInvalidation';

function createEditor(content: Element[]) {
  return withSourceInvalidation(createTestEditor(content));
}

function generateParsedParagraph(text: string): ParagraphElement {
  return Ast.generateElement<ParagraphElement>('paragraph', {
    children: [{ text }],
    source: text,
    spacingAfter: '\n\n',
  });
}

describe('withSourceInvalidation', () => {
  afterEach(cleanup);

  it('clears the source of an edited block', () => {
    const editor = createEditor([
      generateParsedParagraph('One'),
      generateParsedParagraph('Two'),
    ]);

    Transforms.insertText(editor, '!', {
      at: { path: [0, 0], offset: 3 },
    });

    expect((editor.children[0] as Element).source).toBeUndefined();
  });

  it('leaves the source of untouched blocks in place', () => {
    const editor = createEditor([
      generateParsedParagraph('One'),
      generateParsedParagraph('Two'),
    ]);

    Transforms.insertText(editor, '!', {
      at: { path: [0, 0], offset: 3 },
    });

    expect((editor.children[1] as Element).source).toBe('Two');
  });

  it('leaves every block alone when only the selection moves', () => {
    const editor = createEditor([generateParsedParagraph('One')]);

    Transforms.select(editor, { path: [0, 0], offset: 1 });

    expect((editor.children[0] as Element).source).toBe('One');
  });

  it('clears the source of both blocks when one is split', () => {
    const editor = createEditor([
      generateParsedParagraph('One'),
      generateParsedParagraph('Two'),
    ]);

    Transforms.splitNodes(editor, { at: { path: [0, 0], offset: 1 } });

    expect((editor.children[0] as Element).source).toBeUndefined();
    expect((editor.children[1] as Element).source).toBeUndefined();
  });

  it('keeps the spacing of an edited block, which its neighbours rely on', () => {
    const editor = createEditor([
      generateParsedParagraph('One'),
      generateParsedParagraph('Two'),
    ]);

    Transforms.insertText(editor, '!', {
      at: { path: [0, 0], offset: 3 },
    });

    expect((editor.children[0] as Element).spacingAfter).toBe('\n\n');
  });
});
