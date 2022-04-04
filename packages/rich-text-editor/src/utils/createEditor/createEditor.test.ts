import { Node } from 'slate';
import { ParentReferences } from '@minddrop/core';
import { RichTextElement, RICH_TEXT_TEST_DATA } from '@minddrop/rich-text';
import { cleanup, setup } from '../../test-utils';
import { Transforms } from '../../Transforms';
import { createEditor } from './createEditor';

const { inlineEquationElement1, blockEquationElement1, paragraphElement1 } =
  RICH_TEXT_TEST_DATA;

describe('createEditor', () => {
  beforeAll(setup);

  afterAll(cleanup);

  it('configures the `isInline` method', () => {
    // Create an editor
    const editor = createEditor('document-id');

    // Check if an RichTextInlineElement is an inline element.
    // Should return true.
    expect(editor.isInline(inlineEquationElement1)).toBeTruthy();

    // Check if an RichTextBlockElement is an inline element.
    // Should return false.
    expect(editor.isInline(blockEquationElement1)).toBeFalsy();
  });

  it('configures the `isVoid` method', () => {
    // Create an editor
    const editor = createEditor('document-id');

    // Check if an void element is void. Should return true.
    expect(editor.isVoid(inlineEquationElement1)).toBeTruthy();

    // Check if an non-void element is void, should return false.
    expect(editor.isVoid(paragraphElement1)).toBeFalsy();
  });

  it('configures the `withElementIDs` plugin', () => {
    // Create an editor
    const editor = createEditor('document-id');

    // Add a new paragraph element which does not have an ID
    Transforms.insertNodes(editor, {
      ...paragraphElement1,
      id: undefined,
    });

    // Get the inserted element from the document
    const element = Node.get(editor, [0]) as RichTextElement;

    // The element should have an ID
    expect(element.id).toBeDefined();
  });

  it('configures the `withParentReferences` plugin', () => {
    // Create an editor
    const editor = createEditor('document-id');

    // Add a new paragraph element
    Transforms.insertNodes(editor, {
      ...paragraphElement1,
      parents: [],
      id: 'new-paragraph',
    });

    // Get the inserted element from the document
    const element = Node.get(editor, [0]) as RichTextElement;

    // The element should have the document as a parent
    expect(
      ParentReferences.contains('rich-text-document', element.parents),
    ).toBeTruthy();
  });
});
