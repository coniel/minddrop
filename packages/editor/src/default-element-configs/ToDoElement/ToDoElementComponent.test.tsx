import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Ast, Element, ToDoElement } from '@minddrop/ast';
import { fireEvent, render, waitFor } from '@minddrop/test-utils';
import { EditorBlockElementConfigsStore } from '../../BlockElementTypeConfigsStore';
import { RichTextEditor } from '../../RichTextEditor';
import { cleanup } from '../../test-utils';
import { ToDoElementConfig } from './ToDoElementConfig';

const toDoElement = Ast.generateElement<ToDoElement>('to-do', {
  checked: false,
  children: [{ text: 'children' }],
});

const toDoElementchecked = { ...toDoElement, checked: true };

describe('ToDoElementComponent', () => {
  beforeEach(() => {
    // Register the test data 'to-do' element type
    EditorBlockElementConfigsStore.add(ToDoElementConfig);
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

  it('toggles the `checked` state to true when the checkbox is clicked', async () => {
    let value: Element[] = [];

    // Render an editor containing a 'to-do' element
    const { findByRole } = render(
      <RichTextEditor
        initialValue={[toDoElement]}
        onChange={(updated) => {
          value = updated;
        }}
      />,
    );

    // The checkbox icon is loaded asynchronously
    const checkbox = await findByRole('button');

    // Click the to-do element's (unchecked) checkbox
    fireEvent.click(checkbox);

    // The editor reports the change asynchronously
    await waitFor(() => expect(value[0]).toMatchObject({ checked: true }));
  });

  it('toggles the `checked` state to false when the checkbox is clicked', async () => {
    let value: Element[] = [];

    // Render an editor containing a checked 'to-do' element
    const { findByRole } = render(
      <RichTextEditor
        initialValue={[toDoElementchecked]}
        onChange={(updated) => {
          value = updated;
        }}
      />,
    );

    // The checkbox icon is loaded asynchronously
    const checkbox = await findByRole('button');

    // Click the to-do element's (checked) checkbox
    fireEvent.click(checkbox);

    // The editor reports the change asynchronously
    await waitFor(() => expect(value[0]).toMatchObject({ checked: false }));
  });
});
