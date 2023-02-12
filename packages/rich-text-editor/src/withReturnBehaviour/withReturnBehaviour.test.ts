import {
  RichTextElements,
  RICH_TEXT_TEST_DATA,
  RTBlockElement,
} from '@minddrop/rich-text';
import { Transforms } from 'slate';
import { setup, cleanup, createTestEditor, core } from '../test-utils';
import { Editor } from '../types';
import { withReturnBehaviour } from './withReturnBehaviour';

const {
  toDoElementCompleted1,
  toDoElementConfig,
  headingElement1,
  headingElementConfig,
  paragraphElement1,
  paragraphElementConfig,
} = RICH_TEXT_TEST_DATA;

const createEditor = (content: RTBlockElement[]) =>
  withReturnBehaviour(createTestEditor(content));

const insertBreak = (editor: Editor) => {
  // Set the selection to the end of the to-do element text
  Transforms.setSelection(editor, {
    anchor: { path: [0, 0], offset: 4 },
    focus: { path: [0, 0], offset: 4 },
  });

  // Insert a break
  editor.insertBreak();
};

describe('withReturnBehaviour', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('defaults to "break-out" behaviour', () => {
    // Register a 'test-heading' element type with
    // unspecified return behaviour.
    RichTextElements.register(core, {
      ...headingElementConfig,
      type: 'test-heading',
    });

    // Create an editor containing a 'test-heading' element
    const editor = createEditor([
      {
        ...headingElement1,
        type: 'test-heading',
        children: [{ text: 'Test' }],
      },
    ]);

    // Insert a break at the end of the text
    insertBreak(editor);

    // New element should have default 'paragraph' type
    expect(editor.children[1]).toMatchObject({ type: 'paragraph' });
  });

  it('handles "break-out" behaviour', () => {
    // Register a 'test-heading' element type with
    // a 'break-out' return behaviour.
    RichTextElements.register(core, {
      ...headingElementConfig,
      type: 'test-heading',
      returnBehaviour: 'break-out',
    });

    // Create an editor containing a 'test-heading' element
    const editor = createEditor([
      {
        ...headingElement1,
        type: 'test-heading',
        children: [{ text: 'Test' }],
      },
    ]);

    // Insert a break at the end of the text
    insertBreak(editor);

    // New element should have default 'paragraph' type
    expect(editor.children[1]).toMatchObject({ type: 'paragraph' });
  });

  it('handles "line-break" behaviour', () => {
    // Register a 'test-code' element type with
    // a 'soft-break' return behaviour.
    RichTextElements.register(core, {
      ...paragraphElementConfig,
      type: 'test-code',
      returnBehaviour: 'line-break',
    });

    // Create an editor containing a 'test-code' element
    const editor = createEditor([
      {
        ...paragraphElement1,
        type: 'test-code',
        children: [{ text: 'Test' }],
      },
    ]);

    // Insert a break at the end of the text
    insertBreak(editor);

    // Should not create a new element
    expect(editor.children.length).toBe(1);
    // Should insert a line break
    expect(editor.children[0]).toMatchObject({
      children: [{ text: 'Test\n' }],
    });
  });

  it('handles "same-type" behaviour', () => {
    // Register a 'test-to-do' element type with
    // a 'same-type' return behaviour.
    RichTextElements.register(core, {
      ...toDoElementConfig,
      type: 'test-to-do',
      returnBehaviour: 'same-type',
    });

    // Create an editor containing a 'test-to-do' element
    const editor = createEditor([
      {
        ...toDoElementCompleted1,
        type: 'test-to-do',
        children: [{ text: 'Test' }],
      },
    ]);

    // Insert a break at the end of the text
    insertBreak(editor);

    // New element should be of the same type
    expect(editor.children[1]).toMatchObject({ type: 'test-to-do' });
  });

  it('handles callback behaviour', () => {
    // Register a 'test-to-do' element type with
    // a return behaviour that sets `done` to false.
    RichTextElements.register(core, {
      ...toDoElementConfig,
      type: 'test-to-do',
      returnBehaviour: () => ({ done: false }),
    });

    // Create an editor containing a completed 'test-to-do' element
    const editor = createEditor([
      {
        ...toDoElementCompleted1,
        type: 'test-to-do',
        children: [{ text: 'Test' }],
      },
    ]);

    // Insert a break at the end of the text
    insertBreak(editor);

    // New element should be of the same type and have
    // `done` set to false.
    expect(editor.children[1]).toMatchObject({
      type: 'test-to-do',
      done: false,
    });
  });
});
