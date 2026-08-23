import { Transforms } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { Ast, Element, ParagraphElement } from '@minddrop/ast';
import { cleanup, createTestEditor } from '../test-utils';
import { withSourceInvalidation } from './withSourceInvalidation';

function createEditor(content: Element[]) {
  return withSourceInvalidation(createTestEditor(content));
}

function generateParsedParagraph(
  text: string,
  spacingAfter = '\n\n',
): ParagraphElement {
  return Ast.generateElement<ParagraphElement>('paragraph', {
    children: [{ text }],
    source: text,
    spacingAfter,
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

  it('clears the spacing of a split block, which a new block now follows', () => {
    const editor = createEditor([generateParsedParagraph('One')]);

    Transforms.splitNodes(editor, { at: { path: [0, 0], offset: 1 } });

    expect((editor.children[0] as Element).spacingAfter).toBeUndefined();
    // The second half is followed by whatever followed the block it was
    // split from, so it keeps the spacing it inherited
    expect((editor.children[1] as Element).spacingAfter).toBe('\n\n');
  });

  it('clears the spacing of the block a new block is inserted after', () => {
    const editor = createEditor([
      generateParsedParagraph('One'),
      generateParsedParagraph('Two'),
    ]);

    Transforms.insertNodes(editor, Ast.generateElement('paragraph'), {
      at: [1],
    });

    expect((editor.children[0] as Element).spacingAfter).toBeUndefined();
  });

  it('clears the spacing of the block a removed block followed', () => {
    const editor = createEditor([
      generateParsedParagraph('One'),
      generateParsedParagraph('Two'),
      generateParsedParagraph('Three'),
    ]);

    Transforms.removeNodes(editor, { at: [1] });

    expect((editor.children[0] as Element).spacingAfter).toBeUndefined();
  });

  it('clears the spacing of the blocks a move reorders', () => {
    const editor = createEditor([
      generateParsedParagraph('One'),
      generateParsedParagraph('Two'),
      generateParsedParagraph('Three'),
    ]);

    Transforms.moveNodes(editor, { at: [2], to: [0] });

    expect((editor.children[0] as Element).spacingAfter).toBeUndefined();
    expect((editor.children[1] as Element).spacingAfter).toBeUndefined();
  });

  it('gives the trailing spacing to the block a removal leaves last', () => {
    const editor = createEditor([
      generateParsedParagraph('One'),
      generateParsedParagraph('Two', '\n'),
    ]);

    Transforms.removeNodes(editor, { at: [1] });

    expect((editor.children[0] as Element).spacingAfter).toBe('\n');
  });

  it('gives the trailing spacing to the block a move leaves last', () => {
    const editor = createEditor([
      generateParsedParagraph('One'),
      generateParsedParagraph('Two', '\n'),
    ]);

    Transforms.moveNodes(editor, { at: [1], to: [0] });

    expect((editor.children[1] as Element).spacingAfter).toBe('\n');
  });

  it('keeps the trailing spacing on a block which stays last', () => {
    const editor = createEditor([generateParsedParagraph('One', '\n')]);

    Transforms.splitNodes(editor, { at: { path: [0, 0], offset: 1 } });

    expect((editor.children[1] as Element).spacingAfter).toBe('\n');
  });

  it('leaves the spacing of blocks a change does not reach', () => {
    const editor = createEditor([
      generateParsedParagraph('One'),
      generateParsedParagraph('Two'),
      generateParsedParagraph('Three'),
    ]);

    Transforms.splitNodes(editor, { at: { path: [2, 0], offset: 1 } });

    expect((editor.children[0] as Element).spacingAfter).toBe('\n\n');
  });
});
