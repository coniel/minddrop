import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Ast, Element } from '@minddrop/ast';
import { act, fireEvent, render } from '@minddrop/test-utils';
import {
  cleanup,
  headingElement1,
  headingElement1PlainText,
  paragraphElement1,
  paragraphElement1PlainText,
  paragraphElement2,
  paragraphElement2PlainText,
  setup,
} from '../test-utils';
import { ACTIVATION_DELAY } from '../useHoveredBlock';
import { RichTextEditor } from './RichTextEditor';

// The accessible labels of the block gutter's buttons
const INSERT_LABEL = 'Insert block';
const SELECT_LABEL = 'Select block';

// Slate batches operations and fires onChange in a microtask, so
// editor interactions are wrapped in async act calls.
const actFlush = (interaction: () => void) =>
  act(async () => {
    interaction();
  });

// Moves the pointer over an element and waits out the gutter's
// activation delay, after which its controls are shown
const hoverBlock = (element: HTMLElement) => {
  fireEvent.pointerMove(element);

  act(() => {
    vi.advanceTimersByTime(ACTIVATION_DELAY);
  });
};

describe('RichTextEditor block gutter', () => {
  beforeEach(() => {
    setup();

    // The gutter's activation delay is driven by a timer
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  });

  afterEach(() => {
    vi.useRealTimers();

    cleanup();
  });

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

    hoverBlock(getByText(paragraphElement1PlainText));

    expect(queryByLabelText(INSERT_LABEL)).not.toBeNull();
  });

  it('does not show the insert button in a read-only editor', () => {
    const { getByText, queryByLabelText } = renderEditor(true);

    hoverBlock(getByText(paragraphElement1PlainText));

    expect(queryByLabelText(INSERT_LABEL)).toBeNull();
  });

  it('inserts a block below the hovered block', async () => {
    const { getByText, getByLabelText, changeValues } = renderEditor();

    hoverBlock(getByText(paragraphElement1PlainText));

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

    hoverBlock(getByText(headingElement1PlainText));

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

    hoverBlock(getByText(paragraphElement1PlainText));

    await actFlush(() => {
      fireEvent.click(getByLabelText(INSERT_LABEL));
    });

    expect(queryByLabelText(INSERT_LABEL)).toBeNull();
  });

  it('hides the insert button while typing', () => {
    const { getByText, queryByLabelText } = renderEditor();

    hoverBlock(getByText(paragraphElement1PlainText));
    fireEvent.keyDown(getByText(paragraphElement1PlainText), { key: 'a' });

    expect(queryByLabelText(INSERT_LABEL)).toBeNull();
  });

  it('inserts an empty block', async () => {
    const { getByText, getByLabelText, changeValues } = renderEditor();

    hoverBlock(getByText(paragraphElement1PlainText));

    await actFlush(() => {
      fireEvent.click(getByLabelText(INSERT_LABEL));
    });

    const value = changeValues[changeValues.length - 1];

    expect(value[1]).toMatchObject({ children: [{ text: '' }] });
  });

  it('gives the inserted block its own ID', async () => {
    const { getByText, getByLabelText, changeValues } = renderEditor();

    hoverBlock(getByText(paragraphElement1PlainText));

    await actFlush(() => {
      fireEvent.click(getByLabelText(INSERT_LABEL));
    });

    const value = changeValues[changeValues.length - 1];
    const ids = value.map((element) => (element as { id?: string }).id);

    expect(ids.filter(Boolean)).toHaveLength(3);
    expect(new Set(ids).size).toBe(3);
  });
});

describe('RichTextEditor block drag and drop', () => {
  beforeEach(() => {
    setup();

    // The gutter's activation delay is driven by a timer
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  });

  afterEach(() => {
    vi.useRealTimers();

    cleanup();
  });

  // Renders an editor and collects the values it emits. Blocks have
  // no size in jsdom, so every drop point resolves to the top of the
  // block dragged over; which side of a block a drop lands on is
  // covered by the getBlockDropIndex tests.
  const renderEditor = () => {
    const changeValues: Element[][] = [];

    const result = render(
      <RichTextEditor
        initialValue={[paragraphElement1, paragraphElement2, headingElement1]}
        onChange={(value) => changeValues.push(value)}
      />,
    );

    return { ...result, changeValues };
  };

  // Stands in for the browser's drag data, which jsdom does not
  // provide
  const createDataTransfer = () => {
    const data: Record<string, string> = {};

    return {
      effectAllowed: '',
      dropEffect: '',
      setData: (format: string, value: string) => {
        data[format] = value;
      },
      getData: (format: string) => data[format],
      setDragImage: () => undefined,
    };
  };

  it('shows the drop indicator while a block is dragged over the editor', () => {
    const { getByText, getByLabelText, baseElement } = renderEditor();
    const dataTransfer = createDataTransfer();

    hoverBlock(getByText(paragraphElement1PlainText));
    fireEvent.dragStart(getByLabelText(SELECT_LABEL), { dataTransfer });

    expect(
      baseElement.querySelector('.editor-block-drop-indicator'),
    ).toBeNull();

    fireEvent.dragOver(getByText(headingElement1PlainText), {
      dataTransfer,
      clientY: 1,
    });

    expect(
      baseElement.querySelector('.editor-block-drop-indicator'),
    ).not.toBeNull();
  });

  it('moves the dragged block to where it is dropped', async () => {
    const { getByText, getByLabelText, changeValues } = renderEditor();
    const dataTransfer = createDataTransfer();

    // Drag the first paragraph over the heading, which drops it
    // between the second paragraph and the heading
    hoverBlock(getByText(paragraphElement1PlainText));
    fireEvent.dragStart(getByLabelText(SELECT_LABEL), { dataTransfer });
    fireEvent.dragOver(getByText(headingElement1PlainText), { dataTransfer });

    await actFlush(() => {
      fireEvent.drop(getByText(headingElement1PlainText), { dataTransfer });
    });

    const value = changeValues[changeValues.length - 1];

    expect(value.map((element) => element.type)).toEqual([
      'paragraph',
      'paragraph',
      'heading',
    ]);
    expect(Ast.toPlainText([value[1]])).toBe(paragraphElement1PlainText);
  });

  it('does not move blocks dropped where they already are', async () => {
    const { getByText, getByLabelText, changeValues } = renderEditor();
    const dataTransfer = createDataTransfer();

    // Dropping above the block below it leaves it where it is
    hoverBlock(getByText(paragraphElement1PlainText));
    fireEvent.dragStart(getByLabelText(SELECT_LABEL), { dataTransfer });
    fireEvent.dragOver(getByText(paragraphElement2PlainText), { dataTransfer });

    await actFlush(() => {
      fireEvent.drop(getByText(paragraphElement2PlainText), { dataTransfer });
    });

    // Starting the drag selects the block, which emits a value of
    // its own, so the order is what is checked rather than whether
    // anything was emitted at all
    changeValues.forEach((value) => {
      expect(Ast.toPlainText([value[0]])).toBe(paragraphElement1PlainText);
    });
  });

  it('hides the drop indicator once the blocks are dropped', async () => {
    const { getByText, getByLabelText, baseElement } = renderEditor();
    const dataTransfer = createDataTransfer();

    hoverBlock(getByText(paragraphElement1PlainText));
    fireEvent.dragStart(getByLabelText(SELECT_LABEL), { dataTransfer });
    fireEvent.dragOver(getByText(headingElement1PlainText), {
      dataTransfer,
      clientY: 1,
    });

    await actFlush(() => {
      fireEvent.drop(getByText(headingElement1PlainText), { dataTransfer });
    });

    expect(
      baseElement.querySelector('.editor-block-drop-indicator'),
    ).toBeNull();
  });

  it('leaves drags it did not start to the editor', () => {
    const { getByText, baseElement } = renderEditor();

    // No block drag was started, so this is an ordinary drag of
    // editor content
    fireEvent.dragOver(getByText(headingElement1PlainText), {
      dataTransfer: createDataTransfer(),
      clientY: 1,
    });

    expect(
      baseElement.querySelector('.editor-block-drop-indicator'),
    ).toBeNull();
  });
});

describe('RichTextEditor block selection', () => {
  beforeEach(() => {
    setup();

    // The gutter's activation delay is driven by a timer
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  });

  afterEach(() => {
    vi.useRealTimers();

    cleanup();
  });

  // Renders an editor holding a paragraph and a heading
  const renderEditor = () =>
    render(
      <RichTextEditor initialValue={[paragraphElement1, headingElement1]} />,
    );

  // Whether the block containing the given text is marked as selected
  const isSelected = (element: HTMLElement) =>
    element.closest('[data-block-selected="true"]') !== null;

  it('selects the block when its handle is clicked', async () => {
    const { getByText, getByLabelText } = renderEditor();

    hoverBlock(getByText(paragraphElement1PlainText));

    await actFlush(() => {
      fireEvent.click(getByLabelText(SELECT_LABEL));
    });

    expect(isSelected(getByText(paragraphElement1PlainText))).toBe(true);
    expect(isSelected(getByText(headingElement1PlainText))).toBe(false);
  });

  it('opens the actions menu from the handle', async () => {
    const { getByText, getByLabelText, queryByText } = renderEditor();

    hoverBlock(getByText(paragraphElement1PlainText));

    expect(queryByText('Duplicate')).toBeNull();

    await actFlush(() => {
      fireEvent.click(getByLabelText(SELECT_LABEL));
    });

    expect(queryByText('Duplicate')).not.toBeNull();
  });

  it('keeps the controls while the actions menu is open', async () => {
    const { getByText, getByLabelText, queryByLabelText, baseElement } =
      renderEditor();

    hoverBlock(getByText(paragraphElement1PlainText));

    await actFlush(() => {
      fireEvent.click(getByLabelText(SELECT_LABEL));
    });

    // The controls hold the menu's anchor, so they have to outlive
    // the pointer leaving them
    fireEvent.pointerMove(baseElement);

    expect(queryByLabelText(SELECT_LABEL)).not.toBeNull();
  });

  it('deselects its blocks when another editor selects some', async () => {
    const { getAllByText, getAllByLabelText } = render(
      <>
        <RichTextEditor initialValue={[paragraphElement1]} />
        <RichTextEditor initialValue={[paragraphElement1]} />
      </>,
    );

    const [firstEditorBlock, secondEditorBlock] = getAllByText(
      paragraphElement1PlainText,
    );

    hoverBlock(firstEditorBlock);

    await actFlush(() => {
      fireEvent.click(getAllByLabelText(SELECT_LABEL)[0]);
    });

    expect(isSelected(firstEditorBlock)).toBe(true);

    // Clicking the handle opens the actions menu, which holds the
    // first editor's controls open until it is dismissed
    await actFlush(() => {
      fireEvent.keyDown(document.body, { key: 'Escape' });
    });

    hoverBlock(secondEditorBlock);

    await actFlush(() => {
      fireEvent.click(getAllByLabelText(SELECT_LABEL)[0]);
    });

    // The app's selection holds one selection, so selecting in the
    // second editor deselects the first editor's blocks
    expect(isSelected(firstEditorBlock)).toBe(false);
    expect(isSelected(secondEditorBlock)).toBe(true);
  });

  it('extends the selection when a handle is shift clicked', async () => {
    const { getByText, getByLabelText } = renderEditor();

    hoverBlock(getByText(paragraphElement1PlainText));

    await actFlush(() => {
      fireEvent.click(getByLabelText(SELECT_LABEL));
    });

    fireEvent.pointerMove(getByText(headingElement1PlainText));

    await actFlush(() => {
      fireEvent.click(getByLabelText(SELECT_LABEL), { shiftKey: true });
    });

    expect(isSelected(getByText(paragraphElement1PlainText))).toBe(true);
    expect(isSelected(getByText(headingElement1PlainText))).toBe(true);
  });
});
