import { RICH_TEXT_TEST_DATA } from '@minddrop/rich-text';
import { cleanup, setup } from '../../test-utils';
import { createEditor } from './createEditor';

const { inlineEquationElement1, blockEquationElement1, paragraphElement1 } =
  RICH_TEXT_TEST_DATA;

describe('createEditor', () => {
  beforeAll(setup);

  afterAll(cleanup);

  it('configures the `isInline` method', () => {
    // Create an editor
    const editor = createEditor();

    // Check if an RichTextInlineElement is an inline element.
    // Should return true.
    expect(editor.isInline(inlineEquationElement1)).toBeTruthy();

    // Check if an RichTextBlockElement is an inline element.
    // Should return false.
    expect(editor.isInline(blockEquationElement1)).toBeFalsy();
  });

  it('configures the `isVoid` method', () => {
    // Create an editor
    const editor = createEditor();

    // Check if an void element is void. Should return true.
    expect(editor.isVoid(inlineEquationElement1)).toBeTruthy();

    // Check if an non-void element is void, should return false.
    expect(editor.isVoid(paragraphElement1)).toBeFalsy();
  });
});
