import { describe, beforeAll, afterAll, it, expect } from 'vitest';
import { BaseEditor, NodeEntry } from 'slate';
import { ReactEditor } from 'slate-react';
import { RichTextNode, RichTextElement } from '../../types';
import { cleanup, createTestEditor, setup } from '../../test-utils';
import { getElementAbove } from './getElementAbove';
import { Transforms } from 'slate';
import {
  inlineMathElement1,
  paragraphElement1,
} from '../../test-utils/rich-text-editor.data';

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: RichTextElement;
    Text: RichTextNode;
  }
}

describe('getElementAbove', () => {
  beforeAll(setup);

  afterAll(cleanup);

  it('gets the element above the selection', () => {
    // Create an editor in which a paragraph containing text
    const editor = createTestEditor([
      {
        ...paragraphElement1,
        children: [{ text: 'Hello world' }],
      },
    ]);

    // Set the selection to part of the paragraph's text
    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 5 },
    });

    // Get the element above
    const element = getElementAbove(editor) as NodeEntry<RichTextElement>;

    // The element above should be the paragraph
    expect(element[0].type).toBe('paragraph');
  });

  it('gets the element above `at`', () => {
    // Create an editor in which a paragraph contains an inline euqation
    const editor = createTestEditor([
      {
        ...paragraphElement1,
        children: [{ text: '' }, inlineMathElement1, { text: '' }],
      },
    ]);

    // Get the element above the inline equation
    const element = getElementAbove(editor, {
      at: [0, 1],
    }) as NodeEntry<RichTextElement>;

    // The element above should be the paragraph
    expect(element[0].type).toBe('paragraph');
  });

  it('returns `null` if the element is at the root level', () => {
    // Create an editor in which a paragraph containing text
    const editor = createTestEditor([
      {
        ...paragraphElement1,
        children: [{ text: 'Hello world' }],
      },
    ]);

    // Get the element above the paragraph
    const element = getElementAbove(editor, { at: [0] });

    // The element above should be `null`
    expect(element).toBeNull();
  });
});
