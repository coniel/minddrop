import React from 'react';
import { render, cleanup } from '@minddrop/test-utils';
import { RICH_TEXT_TEST_DATA } from '@minddrop/rich-text';
import SlateReact, { ReactEditor } from 'slate-react';
import { ElementPlaceholderText } from './ElementPlaceholderText';

const { paragraphElement1 } = RICH_TEXT_TEST_DATA;

const emptyElement = { ...paragraphElement1, children: [{ text: '' }] };

const expandedSelection = {
  anchor: { path: [0, 0], offset: 0 },
  focus: { path: [0, 0], offset: 5 },
};

jest.mock('slate-react', () => ({
  useSlate: jest.fn().mockReturnValue({
    // Return an editor with a collapsed selection
    selection: {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    },
  }),
  useSelected: jest.fn().mockReturnValue(true),
  useFocused: jest.fn().mockReturnValue(true),
}));

describe('ElementPlaceholderText', () => {
  afterEach(cleanup);

  it('renders the placeholder text on an empty element', () => {
    // Render with an empty element
    const { getByText } = render(
      <ElementPlaceholderText text="Heading 1" element={emptyElement} />,
    );

    // Should render the placeholder text
    getByText('Heading 1');
  });

  it('does not render on an element with content', () => {
    // Render with an element containig content
    const { queryByText } = render(
      <ElementPlaceholderText text="Heading 1" element={paragraphElement1} />,
    );

    // Should not render the placeholder text
    expect(queryByText('Heading 1')).toBeNull();
  });

  describe('onlyWhenFocused', () => {
    describe('focused empty element', () => {
      it('renders the placeholder text', () => {
        // Render with an empty element
        const { getByText } = render(
          <ElementPlaceholderText
            onlyWhenFocused
            text="Heading 1"
            element={emptyElement}
          />,
        );

        // Should render the placeholder text
        getByText('Heading 1');
      });

      it('does not render if editor is blurred', () => {
        // Blur the editor
        jest.spyOn(SlateReact, 'useFocused').mockReturnValueOnce(false);

        // Render with an empty element
        const { queryByText } = render(
          <ElementPlaceholderText
            onlyWhenFocused
            text="Heading 1"
            element={emptyElement}
          />,
        );

        // Should not render the placeholder text
        expect(queryByText('Heading 1')).toBeNull();
      });

      it('does not render if the selection is expanded', () => {
        // Expand the selection
        jest
          .spyOn(SlateReact, 'useSlate')
          .mockReturnValueOnce({ selection: expandedSelection } as ReactEditor);

        // Render with an empty element
        const { queryByText } = render(
          <ElementPlaceholderText
            onlyWhenFocused
            text="Heading 1"
            element={emptyElement}
          />,
        );

        // Should not render the placeholder text
        expect(queryByText('Heading 1')).toBeNull();
      });
    });

    describe('element not focused', () => {
      it('does not render on an empty element', () => {
        // Blur the element
        jest.spyOn(SlateReact, 'useSelected').mockReturnValueOnce(false);

        // Render with an empty element
        const { queryByText } = render(
          <ElementPlaceholderText
            onlyWhenFocused
            text="Heading 1"
            element={emptyElement}
          />,
        );

        // Should not render the placeholder text
        expect(queryByText('Heading 1')).toBeNull();
      });
    });
  });
});
