import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { act, fireEvent, render } from '@minddrop/test-utils';
import { ToDoElementData } from './ToDoElement.types';
import { cleanup } from '../../test-utils';
import { RichTextEditor } from '../../RichTextEditor';
import { ToDoElementConfig } from './ToDoElementConfig';
import { registerElementConfig } from '../../registerElementConfig';
import { BlockElement } from '../../types';

const toDoElement: BlockElement<ToDoElementData> = {
  level: 'block',
  type: 'to-do',
  done: false,
  children: [{ text: 'children' }],
};

const toDoElementDone = { ...toDoElement, done: true };

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

  it('toggles the `done` state to true when the checkbox is clicked', () =>
    new Promise<void>((done) => {
      // Render an editor containing a 'to-do' element
      const { getByRole } = render(
        <RichTextEditor
          initialValue={[toDoElement]}
          onChange={(value) => {
            expect(value[0]).toMatchObject({ done: true });
            done();
          }}
        />,
      );

      act(() => {
        // Click the to-do element's (unchecked) checkbox
        fireEvent.click(getByRole('button'));
      });
    }));

  it('toggles the `done` state to false when the checkbox is clicked', () =>
    new Promise<void>((done) => {
      // Render an editor containing a done 'to-do' element
      const { getByRole } = render(
        <RichTextEditor
          initialValue={[toDoElementDone]}
          onChange={(value) => {
            expect(value[0]).toMatchObject({ done: false });
            done();
          }}
        />,
      );

      act(() => {
        // Click the to-do element's (unchecked) checkbox
        fireEvent.click(getByRole('button'));
      });
    }));
});
