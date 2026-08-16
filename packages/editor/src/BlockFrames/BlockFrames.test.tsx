import { Editable, Slate } from 'slate-react';
import { afterEach, describe, expect, it } from 'vitest';
import { BlockquoteFrame, Element, ListItemFrame } from '@minddrop/ast';
import { fireEvent, render, waitFor } from '@minddrop/test-utils';
import { BlockFramesProvider } from '../BlockFramesContext';
import { EditorElementConfigs } from '../EditorElementConfigs';
import { RichTextEditor } from '../RichTextEditor';
import { cleanup, createTestEditor } from '../test-utils';
import {
  listItemFrame1,
  paragraphElement1,
  paragraphElement2,
} from '../test-utils/editor.data';
import { createRenderElement } from '../utils';
import { assignBlockIds } from '../withBlockIds';

const orderedItemFrame1: ListItemFrame = {
  id: 'ordered-item-1',
  kind: 'list-item',
  ordered: true,
  marker: ')',
  number: 3,
};

const taskItemFrame1: ListItemFrame = { ...listItemFrame1, checked: true };

const blockquoteFrame1: BlockquoteFrame = {
  id: 'blockquote-1',
  kind: 'blockquote',
};

const renderEditor = (content: Element[]) => {
  const value = assignBlockIds(content);
  const editor = createTestEditor(value);

  return render(
    <Slate editor={editor} initialValue={value}>
      <BlockFramesProvider>
        <Editable renderElement={createRenderElement(EditorElementConfigs)} />
      </BlockFramesProvider>
    </Slate>,
  );
};

describe('BlockFrames', () => {
  afterEach(cleanup);

  it('does not wrap a block which has no containers', () => {
    const { container } = renderEditor([paragraphElement1]);

    expect(container.querySelector('.block-frames')).toBeNull();
  });

  it('renders a bullet for an unordered list item', () => {
    const { container } = renderEditor([
      { ...paragraphElement1, ancestry: [listItemFrame1] },
    ]);

    expect(container.querySelector('.block-frame-bullet')).not.toBeNull();
  });

  it('renders an ordered item as its number and marker', () => {
    const { getByText } = renderEditor([
      { ...paragraphElement1, ancestry: [orderedItemFrame1] },
    ]);

    expect(getByText('3)')).not.toBeNull();
  });

  it('renders a checkbox for a task item', () => {
    const { container } = renderEditor([
      { ...paragraphElement1, ancestry: [taskItemFrame1] },
    ]);

    expect(
      container.querySelector('.block-frame-task-checkbox'),
    ).not.toBeNull();
  });

  it('renders a quote bar on every block of a quote', () => {
    const { container } = renderEditor([
      { ...paragraphElement1, ancestry: [blockquoteFrame1] },
      { ...paragraphElement2, ancestry: [blockquoteFrame1] },
    ]);

    expect(container.querySelectorAll('.block-frame-quote-bar')).toHaveLength(
      2,
    );
  });

  describe('task checkbox', () => {
    // Renders an editor containing a single task item, reporting its changes
    const renderTaskItem = (checked: boolean) => {
      const value: { current: Element[] } = { current: [] };
      const rendered = render(
        <RichTextEditor
          initialValue={[
            {
              ...paragraphElement1,
              ancestry: [{ ...listItemFrame1, checked }],
            },
          ]}
          onChange={(updated) => {
            value.current = updated;
          }}
        />,
      );

      return { ...rendered, value };
    };

    it('ticks an unticked item when clicked', async () => {
      const { findByRole, value } = renderTaskItem(false);

      // The checkbox icon is loaded asynchronously
      fireEvent.click(await findByRole('button'));

      await waitFor(() =>
        expect(value.current[0].ancestry?.[0]).toMatchObject({ checked: true }),
      );
    });

    it('strikes through the content of a ticked item', () => {
      const { container } = renderEditor([
        { ...paragraphElement1, ancestry: [taskItemFrame1] },
      ]);

      expect(container.querySelector('.block-frames-checked')).not.toBeNull();
    });

    it('leaves the content of an unticked item alone', () => {
      const { container } = renderEditor([
        {
          ...paragraphElement1,
          ancestry: [{ ...listItemFrame1, checked: false }],
        },
      ]);

      expect(container.querySelector('.block-frames-checked')).toBeNull();
    });

    it('does not strike through an item nested inside a ticked one', () => {
      const { container } = renderEditor([
        { ...paragraphElement1, ancestry: [taskItemFrame1] },
        {
          ...paragraphElement2,
          // A child item of its own, which keeps the state it was given
          ancestry: [
            taskItemFrame1,
            { ...listItemFrame1, id: 'item-2', checked: false },
          ],
        },
      ]);

      expect(container.querySelectorAll('.block-frames-checked')).toHaveLength(
        1,
      );
    });

    it('unticks a ticked item when clicked', async () => {
      const { findByRole, value } = renderTaskItem(true);

      fireEvent.click(await findByRole('button'));

      await waitFor(() =>
        expect(value.current[0].ancestry?.[0]).toMatchObject({
          checked: false,
        }),
      );
    });
  });

  it('marks only the first block of a list item', () => {
    const { container } = renderEditor([
      { ...paragraphElement1, ancestry: [listItemFrame1] },
      { ...paragraphElement2, ancestry: [listItemFrame1] },
    ]);

    // Both blocks are indented, but only the one which opens the item
    // draws its bullet
    expect(container.querySelectorAll('.block-frames')).toHaveLength(2);
    expect(container.querySelectorAll('.block-frame-bullet')).toHaveLength(1);
  });
});
