import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Element } from '@minddrop/ast';
import {
  cleanup,
  createTestEditor,
  linkElement1,
  paragraphElement1,
  setup,
} from '../../test-utils';
import { normalizePlainTextContent } from './normalizePlainTextContent';

describe('normalizePlainTextContent', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('unwraps nested elements', () => {
    // Create an editor with a link element inside the paragraph
    const editor = createTestEditor([
      {
        ...paragraphElement1,
        children: [{ text: 'Before ' }, linkElement1, { text: ' after' }],
      },
    ]);

    // A fix should be applied
    expect(normalizePlainTextContent(editor, [0])).toBe(true);

    // The paragraph should contain only text children
    (editor.children[0] as Element).children.forEach((child) => {
      expect(child).not.toHaveProperty('type');
    });
  });

  it('strips marks from the text', () => {
    // Create an editor with a bold mark on the paragraph text
    const editor = createTestEditor([
      { ...paragraphElement1, children: [{ text: 'Bold text', bold: true }] },
    ]);

    // A fix should be applied
    expect(normalizePlainTextContent(editor, [0])).toBe(true);

    // The mark should be stripped from the text
    expect((editor.children[0] as Element).children[0]).not.toHaveProperty(
      'bold',
    );
  });

  it('removes newline characters from the text', () => {
    // Create an editor with a newline in the paragraph text
    const editor = createTestEditor([
      { ...paragraphElement1, children: [{ text: 'Multi\nline' }] },
    ]);

    // A fix should be applied
    expect(normalizePlainTextContent(editor, [0])).toBe(true);

    // The newline should be removed from the text
    expect(editor.children[0]).toMatchObject({
      children: [{ text: 'Multiline' }],
    });
  });

  it('applies at most one fix per call', () => {
    // Create an editor with both a mark and a newline in the text
    const editor = createTestEditor([
      {
        ...paragraphElement1,
        children: [{ text: 'Multi\nline', bold: true }],
      },
    ]);

    // The first call should only strip the mark
    normalizePlainTextContent(editor, [0]);

    expect(editor.children[0]).toMatchObject({
      children: [{ text: 'Multi\nline' }],
    });

    // The second call should remove the newline
    normalizePlainTextContent(editor, [0]);

    expect(editor.children[0]).toMatchObject({
      children: [{ text: 'Multiline' }],
    });
  });

  it('returns false for plain text content', () => {
    // Create an editor with a plain text paragraph
    const editor = createTestEditor([paragraphElement1]);

    // No fix should be applied
    expect(normalizePlainTextContent(editor, [0])).toBe(false);
  });
});
