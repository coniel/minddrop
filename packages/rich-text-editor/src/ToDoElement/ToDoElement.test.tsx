import React from 'react';
import { act, fireEvent, render } from '@minddrop/test-utils';
import { ToDoElement } from './ToDoElement.types';
import { createTestDocument } from '../test-utils';
import { RichTextEditor } from '../RichTextEditor';
import { ToDoElementConfig } from './ToDoElementConfig';
import { RichTextElements } from '@minddrop/rich-text';

const toDoElement: ToDoElement = {
  id: 'to-do-element-id',
  type: 'to-do',
  done: false,
  parents: [],
  children: [{ text: 'children' }],
};

const document = createTestDocument([ToDoElementConfig], [toDoElement]);

describe('ToDoElementComponent', () => {
  it('renders it children', () => {
    // Render an editor containing a 'to-do' element
    const { getByText } = render(<RichTextEditor documentId={document.id} />);

    // Should render children
    getByText('children');
  });

  it('toggles the `done` state when the checkbox is clicked', () => {
    // Use fake timers to skip the update debouncing timeout
    jest.useFakeTimers();

    // Render an editor containing a 'to-do' element
    const { getByRole } = render(<RichTextEditor documentId={document.id} />);

    act(() => {
      // Click the to-do element's (unchecked) checkbox
      fireEvent.click(getByRole('button'));
    });

    act(() => {
      // Run timers to skip update debouncing timer
      jest.runAllTimers();
    });

    // Get the updated to-do element
    let element = RichTextElements.get<ToDoElement>(toDoElement.id);

    // Should have `done` set to `true`
    expect(element.done).toBe(true);

    act(() => {
      // Click the to-do element's (checked) checkbox
      fireEvent.click(getByRole('button'));
    });

    act(() => {
      // Run timers to skip update debouncing timer
      jest.runAllTimers();
    });

    // Get the updated to-do element
    element = RichTextElements.get<ToDoElement>(toDoElement.id);

    // Should have `done` set to `false`
    expect(element.done).toBe(false);
  });
});
