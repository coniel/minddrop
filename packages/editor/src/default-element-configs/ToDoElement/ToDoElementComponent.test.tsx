import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { act, fireEvent, render } from '@minddrop/test-utils';
import { Ast, ToDoElement } from '@minddrop/ast';
import { cleanup } from '../../test-utils';
import { RichTextEditor } from '../../RichTextEditor';
import { registerElementConfig } from '../../registerElementConfig';
import { ToDoElementConfig } from './ToDoElementConfig';

const toDoElement = Ast.generateBlockElement<ToDoElement>('to-do', {
  checked: false,
  children: [{ text: 'children' }],
});

const toDoElementchecked = { ...toDoElement, checked: true };

describe('ToDoElementComponent', () => {
  beforeEach(() => {
    // Register the test data 'to-do' element type
    registerElementConfig(ToDoElementConfig);
  });

  afterEach(cleanup);

  it('renders it children', () => {
    // Render an editor containing a 'to-do' element
    const { getByText } = render(
      <RichTextEditor initialValue={[toDoElement]} />,
    );

    // Should render children
    getByText('children');
  });

  it('toggles the `checked` state to true when the checkbox is clicked', () =>
    new Promise<void>((checked) => {
      // Render an editor containing a 'to-do' element
      const { getByRole } = render(
        <RichTextEditor
          initialValue={[toDoElement]}
          onChange={(value) => {
            expect(value[0]).toMatchObject({ checked: true });
            checked();
          }}
        />,
      );

      act(() => {
        // Click the to-do element's (unchecked) checkbox
        fireEvent.click(getByRole('button'));
      });
    }));

  it('toggles the `checked` state to false when the checkbox is clicked', () =>
    new Promise<void>((checked) => {
      // Render an editor containing a checked 'to-do' element
      const { getByRole } = render(
        <RichTextEditor
          initialValue={[toDoElementchecked]}
          onChange={(value) => {
            expect(value[0]).toMatchObject({ checked: false });
            checked();
          }}
        />,
      );

      act(() => {
        // Click the to-do element's (unchecked) checkbox
        fireEvent.click(getByRole('button'));
      });
    }));
});
