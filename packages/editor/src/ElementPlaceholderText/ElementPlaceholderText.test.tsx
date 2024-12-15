import { describe, afterEach, it, expect } from 'vitest';
import { Editable, ReactEditor, RenderElementProps, Slate } from 'slate-react';
import {
  render,
  waitFor,
  waitForElementToBeRemoved,
} from '@minddrop/test-utils';
import { Element } from '@minddrop/ast';
import {
  ElementPlaceholderText,
  ElementPlaceholderTextProps,
} from './ElementPlaceholderText';
import { cleanup, headingElement1 } from '../test-utils';
import { createEditor } from '../utils';
import { Editor, Transforms } from 'slate';

const emptyElement = { ...headingElement1, children: [{ text: '' }] };
const elementWithText = headingElement1;

let editor: Editor;

function renderEditor(
  content: Element[],
  options: Omit<ElementPlaceholderTextProps, 'element' | 'text'> = {},
) {
  editor = createEditor();

  const renderElement = (props: RenderElementProps) => (
    <h1 {...props.attributes}>
      <ElementPlaceholderText
        element={props.element}
        text="Heading 1"
        {...options}
      />
      {props.children}
    </h1>
  );

  return render(
    <Slate editor={editor} initialValue={content}>
      <Editable renderElement={renderElement} />
    </Slate>,
  );
}

describe('ElementPlaceholderText', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the placeholder text on an empty element', () => {
    // Render with an empty element
    const { getByText } = renderEditor([emptyElement]);

    // Should render the placeholder text
    getByText('Heading 1');
  });

  it('does not render on an element with content', () => {
    // Render with an element containig content
    const { queryByText } = renderEditor([elementWithText]);

    // Should not render the placeholder text
    expect(queryByText('Heading 1')).toBeNull();
  });

  describe('onlyWhenFocused', () => {
    describe('focused empty element', () => {
      it('renders the placeholder text', async () => {
        // Render with an empty element
        const { getByText } = renderEditor([emptyElement], {
          onlyWhenFocused: true,
        });

        // Focus on the first element
        ReactEditor.focus(editor);
        Transforms.select(editor, [0, 0]);

        // Should render the placeholder text
        await waitFor(() => getByText('Heading 1'));
      });

      it('does not render if editor is blurred', () => {
        // Render with an empty element
        const { queryByText } = renderEditor([emptyElement], {
          onlyWhenFocused: true,
        });

        // Should not render the placeholder text
        expect(queryByText('Heading 1')).toBeNull();
      });

      it('does not render if the selection is expanded', async () => {
        // Render with a couple of empty elements
        const { getByText } = renderEditor([emptyElement, emptyElement], {
          onlyWhenFocused: true,
        });

        // Focus on the first element
        ReactEditor.focus(editor);
        Transforms.select(editor, [0, 0]);

        // Should render the placeholder text
        await waitFor(() => getByText('Heading 1'));

        // Expand selection to include a second element
        Transforms.select(editor, {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [1, 0], offset: 0 },
        });

        // Should not render the placeholder text
        await waitForElementToBeRemoved(() => getByText('Heading 1'));
      });
    });

    describe('element not focused', () => {
      it('does not render on an empty element', async () => {
        // Render with an empty element followed by one with content
        const { getByText } = renderEditor([emptyElement, elementWithText], {
          onlyWhenFocused: true,
        });

        // Focus on the first element (without content)
        ReactEditor.focus(editor);
        Transforms.select(editor, [0, 0]);

        // Should render the placeholder text
        await waitFor(() => getByText('Heading 1'));

        // Focus on the second element (with content)
        Transforms.select(editor, [1, 0]);

        // Should not render the placeholder text
        await waitForElementToBeRemoved(() => getByText('Heading 1'));
      });
    });
  });
});
