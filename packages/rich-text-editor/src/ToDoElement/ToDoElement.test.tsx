import React from 'react';
import { act, fireEvent, render } from '@minddrop/test-utils';
import { ToDoElementData } from './ToDoElement.types';
import { cleanup, core, createTestDocument, setup } from '../test-utils';
import { RichTextEditor } from '../RichTextEditor';
import { ToDoElementConfig } from './ToDoElementConfig';
import {
  RichTextElements,
  RICH_TEXT_TEST_DATA,
  RTBlockElementDocument,
  RTDocument,
} from '@minddrop/rich-text';
import { Resources } from '@minddrop/resources';

const { toDoElementConfig } = RICH_TEXT_TEST_DATA;

const toDoElement: RTBlockElementDocument<ToDoElementData> =
  Resources.generateDocument('rich-text:element', {
    type: 'to-do',
    done: false,
    children: [{ text: 'children' }],
  });

describe('ToDoElementComponent', () => {
  let document: RTDocument;

  beforeAll(() => {
    setup();

    // Unregister the test data 'to-do' element type
    RichTextElements.unregister(core, toDoElementConfig);

    document = createTestDocument([ToDoElementConfig], [toDoElement]);
  });

  afterAll(cleanup);

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
    let element = RichTextElements.get<ToDoElementData>(toDoElement.id);

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
    element = RichTextElements.get<ToDoElementData>(toDoElement.id);

    // Should have `done` set to `false`
    expect(element.done).toBe(false);
  });
});
