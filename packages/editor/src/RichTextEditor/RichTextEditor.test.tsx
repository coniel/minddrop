import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Element } from '@minddrop/ast';
import { act, fireEvent, render } from '@minddrop/test-utils';
import {
  cleanup,
  headingElement1,
  headingElement1PlainText,
  paragraphElement1,
  paragraphElement1PlainText,
  setup,
} from '../test-utils';
import { RichTextEditor } from './RichTextEditor';

// The accessible label of the block gutter's insert button
const INSERT_LABEL = 'Insert block';

// Slate batches operations and fires onChange in a microtask, so
// editor interactions are wrapped in async act calls.
const actFlush = (interaction: () => void) =>
  act(async () => {
    interaction();
  });

describe('RichTextEditor block gutter', () => {
  beforeEach(setup);

  afterEach(cleanup);

  // Renders an editor and collects the values it emits
  const renderEditor = (readOnly = false) => {
    const changeValues: Element[][] = [];

    const result = render(
      <RichTextEditor
        readOnly={readOnly}
        initialValue={[paragraphElement1, headingElement1]}
        onChange={(value) => changeValues.push(value)}
      />,
    );

    return { ...result, changeValues };
  };

  it('shows the insert button for the hovered block', () => {
    const { getByText, queryByLabelText } = renderEditor();

    // No block is hovered yet
    expect(queryByLabelText(INSERT_LABEL)).toBeNull();

    fireEvent.pointerMove(getByText(paragraphElement1PlainText));

    expect(queryByLabelText(INSERT_LABEL)).not.toBeNull();
  });

  it('does not show the insert button in a read-only editor', () => {
    const { getByText, queryByLabelText } = renderEditor(true);

    fireEvent.pointerMove(getByText(paragraphElement1PlainText));

    expect(queryByLabelText(INSERT_LABEL)).toBeNull();
  });

  it('inserts a block below the hovered block', async () => {
    const { getByText, getByLabelText, changeValues } = renderEditor();

    fireEvent.pointerMove(getByText(paragraphElement1PlainText));

    await actFlush(() => {
      fireEvent.click(getByLabelText(INSERT_LABEL));
    });

    const value = changeValues[changeValues.length - 1];

    // The block is inserted between the paragraph and the heading
    expect(value).toHaveLength(3);
    expect(value[1]).toMatchObject({ type: 'paragraph' });
    expect(value[2]).toMatchObject({ type: 'heading' });
  });

  it('inserts above the hovered block when shift clicked', async () => {
    const { getByText, getByLabelText, changeValues } = renderEditor();

    fireEvent.pointerMove(getByText(headingElement1PlainText));

    await actFlush(() => {
      fireEvent.click(getByLabelText(INSERT_LABEL), { shiftKey: true });
    });

    const value = changeValues[changeValues.length - 1];

    // The block is inserted between the paragraph and the heading
    expect(value).toHaveLength(3);
    expect(value[1]).toMatchObject({ type: 'paragraph' });
    expect(value[2]).toMatchObject({ type: 'heading' });
  });

  it('hides the insert button once a block has been inserted', async () => {
    const { getByText, getByLabelText, queryByLabelText } = renderEditor();

    fireEvent.pointerMove(getByText(paragraphElement1PlainText));

    await actFlush(() => {
      fireEvent.click(getByLabelText(INSERT_LABEL));
    });

    expect(queryByLabelText(INSERT_LABEL)).toBeNull();
  });

  it('hides the insert button while typing', () => {
    const { getByText, queryByLabelText } = renderEditor();

    fireEvent.pointerMove(getByText(paragraphElement1PlainText));
    fireEvent.keyDown(getByText(paragraphElement1PlainText), { key: 'a' });

    expect(queryByLabelText(INSERT_LABEL)).toBeNull();
  });

  it('inserts an empty block', async () => {
    const { getByText, getByLabelText, changeValues } = renderEditor();

    fireEvent.pointerMove(getByText(paragraphElement1PlainText));

    await actFlush(() => {
      fireEvent.click(getByLabelText(INSERT_LABEL));
    });

    const value = changeValues[changeValues.length - 1];

    expect(value[1]).toMatchObject({ children: [{ text: '' }] });
  });

  it('gives the inserted block its own ID', async () => {
    const { getByText, getByLabelText, changeValues } = renderEditor();

    fireEvent.pointerMove(getByText(paragraphElement1PlainText));

    await actFlush(() => {
      fireEvent.click(getByLabelText(INSERT_LABEL));
    });

    const value = changeValues[changeValues.length - 1];
    const ids = value.map((element) => (element as { id?: string }).id);

    expect(ids.filter(Boolean)).toHaveLength(3);
    expect(new Set(ids).size).toBe(3);
  });
});
