import {
  RTElement,
  RichTextElements,
  RICH_TEXT_TEST_DATA,
} from '@minddrop/rich-text';
import { Editor, Node } from 'slate';
import { setup, cleanup, core, createTestEditor } from '../test-utils';
import { Transforms } from '../Transforms';
import { withBlockReset } from './withBlockReset';

const { headingElement1, linkElement1 } = RICH_TEXT_TEST_DATA;

// An empty heading element
const emptyHeading = { ...headingElement1, children: [{ text: '' }] };
// The default element type
const defaultType = 'paragraph';

describe('withBlockReset', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('resets the block type when a break is insterted in an empty block', () => {
    // Create an editor with the plugin applied containing an empty
    // heading element.
    const editor = withBlockReset(
      core,
      createTestEditor([emptyHeading]),
      defaultType,
    );

    // Set focus to the heading element text
    Transforms.setSelection(editor, {
      anchor: Editor.start(editor, [0]),
      focus: Editor.start(editor, [0]),
    });

    // Insert a break
    editor.insertBreak();

    // Get the element
    const element = Node.get(editor, [0]) as RTElement;

    // Element should have been converted into the default type
    expect(element.type).toBe(defaultType);
  });

  it('does not reset inline elements when a break is inserted', () => {
    // Create an editor with the plugin applied containing a
    // heading element with an empty link
    const editor = withBlockReset(
      core,
      createTestEditor([
        {
          ...headingElement1,
          children: [
            { text: '' },
            { ...linkElement1, children: [{ text: '' }] },
            { text: '' },
          ],
        },
      ]),
      defaultType,
    );

    // Set focus to the start of the link text
    Transforms.setSelection(editor, {
      anchor: Editor.start(editor, [0, 1, 0]),
      focus: Editor.start(editor, [0, 1, 0]),
    });

    // Insert a break
    editor.insertBreak();

    // Get the heading element
    const heading = Node.get(editor, [0]) as RTElement;
    // Get the link element
    const link = Node.get(editor, [0, 1]) as RTElement;

    // Heading element should remain a heading
    expect(heading.type).toBe(headingElement1.type);
    // Link element should remain a link
    expect(link.type).toBe(linkElement1.type);
  });

  it('resets the block type when deleting backwards on at the start of a block', () => {
    // Create an editor with the plugin applied containing a
    // heading element.
    const editor = withBlockReset(
      core,
      createTestEditor([headingElement1]),
      defaultType,
    );

    // Set focus to the end of the heading text
    Transforms.setSelection(editor, {
      anchor: Editor.start(editor, [0]),
      focus: Editor.start(editor, [0]),
    });

    // Delete backwards
    editor.deleteBackward('character');

    // Get the element
    const element = Node.get(editor, [0]) as RTElement;

    // Element should have been converted into the default type
    expect(element.type).toBe(defaultType);
  });

  it('performs normal behaviour when deleting backwards in content', () => {
    // Create an editor with the plugin applied containing a
    // heading element.
    const editor = withBlockReset(
      core,
      createTestEditor([
        { ...headingElement1, children: [{ text: 'Hello world' }] },
      ]),
      defaultType,
    );

    // Set focus to the end of the heading text
    Transforms.setSelection(editor, {
      anchor: Editor.end(editor, [0]),
      focus: Editor.end(editor, [0]),
    });

    // Delete backwards
    editor.deleteBackward('character');

    // Get the element
    const element = Node.get(editor, [0]) as RTElement;

    // Element should remain a heading
    expect(element.type).toBe(headingElement1.type);
    // Last character should have been deleted
    expect(RichTextElements.toPlainText([element])).toBe('Hello worl');
  });

  it('does not reset inline elements when deleting backwards', () => {
    // Create an editor with the plugin applied containing a
    // heading element with a link
    const editor = withBlockReset(
      core,
      createTestEditor([
        {
          ...headingElement1,
          children: [{ text: '' }, linkElement1, { text: '' }],
        },
      ]),
      defaultType,
    );

    // Set focus to the start of the link text
    Transforms.setSelection(editor, {
      anchor: Editor.start(editor, [0, 1, 0]),
      focus: Editor.start(editor, [0, 1, 0]),
    });

    // Delete backwards
    editor.deleteBackward('character');

    // Get the heading element
    const heading = Node.get(editor, [0]) as RTElement;
    // Get the link element
    const link = Node.get(editor, [0, 1]) as RTElement;

    // Heading element should remain a heading
    expect(heading.type).toBe(headingElement1.type);
    // Link element should remain a link
    expect(link.type).toBe(linkElement1.type);
  });
});
