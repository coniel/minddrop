import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Ast, Element } from '@minddrop/ast';
import { SelectionItemSerializers } from '@minddrop/selection';
import { act, fireEvent, render } from '@minddrop/test-utils';
import { registerBlockSelectionSerializer } from '../registerBlockSelectionSerializer';
import {
  cleanup,
  headingElement1,
  headingElement1PlainText,
  paragraphElement1,
  paragraphElement1PlainText,
  paragraphElement2,
  paragraphElement2PlainText,
} from '../test-utils';
import { BLOCK_SELECTION_ITEM_TYPE } from '../types';
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
    // Serializes the dragged blocks onto the drag's data, which is
    // what carries them between editors
    registerBlockSelectionSerializer();

    // The gutter's activation delay is driven by a timer
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  });

  afterEach(() => {
    vi.useRealTimers();

    cleanup();

    SelectionItemSerializers.unregister(BLOCK_SELECTION_ITEM_TYPE);
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
      // The written data's types, which editors the drag did not
      // start in use to recognise a block drag
      get types() {
        return Object.keys(data);
      },
      setData: (format: string, value: string) => {
        data[format] = value;
      },
      getData: (format: string) => data[format],
      setDragImage: () => undefined,
    };
  };

  // Renders two editors and collects the values each emits, used to
  // drag blocks from the first editor into the second
  const renderTwoEditors = (secondReadOnly = false) => {
    const firstValues: Element[][] = [];
    const secondValues: Element[][] = [];

    const result = render(
      <>
        <RichTextEditor
          initialValue={[paragraphElement1, paragraphElement2]}
          onChange={(value) => firstValues.push(value)}
        />
        <RichTextEditor
          readOnly={secondReadOnly}
          initialValue={[headingElement1]}
          onChange={(value) => secondValues.push(value)}
        />
      </>,
    );

    return { ...result, firstValues, secondValues };
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

  it('hides the indicator when the drag moves off the editor', () => {
    const { getByText, getByLabelText, baseElement } = renderEditor();
    const dataTransfer = createDataTransfer();

    hoverBlock(getByText(paragraphElement1PlainText));
    fireEvent.dragStart(getByLabelText(SELECT_LABEL), { dataTransfer });
    fireEvent.dragOver(getByText(headingElement1PlainText), {
      dataTransfer,
      clientY: 1,
    });

    expect(
      baseElement.querySelector('.editor-block-drop-indicator'),
    ).not.toBeNull();

    // Drag over somewhere else on the page
    fireEvent.dragOver(baseElement, { dataTransfer });

    expect(
      baseElement.querySelector('.editor-block-drop-indicator'),
    ).toBeNull();
  });

  it('moves blocks dropped into another editor', async () => {
    const { getByText, getByLabelText, firstValues, secondValues } =
      renderTwoEditors();
    const dataTransfer = createDataTransfer();

    // Drag the first editor's first paragraph over the second
    // editor's heading
    hoverBlock(getByText(paragraphElement1PlainText));
    fireEvent.dragStart(getByLabelText(SELECT_LABEL), { dataTransfer });
    fireEvent.dragOver(getByText(headingElement1PlainText), { dataTransfer });

    await actFlush(() => {
      fireEvent.drop(getByText(headingElement1PlainText), { dataTransfer });
    });

    // The paragraph lands above the heading in the second editor
    const secondValue = secondValues[secondValues.length - 1];

    expect(secondValue.map((element) => element.type)).toEqual([
      'paragraph',
      'heading',
    ]);
    expect(Ast.toPlainText([secondValue[0]])).toBe(paragraphElement1PlainText);

    // The paragraph leaves the first editor
    const firstValue = firstValues[firstValues.length - 1];

    expect(Ast.toPlainText(firstValue)).toBe(paragraphElement2PlainText);
  });

  it('shows the drop indicator in the editor being dragged into', () => {
    const { getByText, getByLabelText, baseElement } = renderTwoEditors();
    const dataTransfer = createDataTransfer();

    hoverBlock(getByText(paragraphElement1PlainText));
    fireEvent.dragStart(getByLabelText(SELECT_LABEL), { dataTransfer });
    fireEvent.dragOver(getByText(headingElement1PlainText), {
      dataTransfer,
      clientY: 1,
    });

    expect(
      baseElement.querySelector('.editor-block-drop-indicator'),
    ).not.toBeNull();
  });

  it('hides the other editor’s indicator when the drag ends', () => {
    const { getByText, getByLabelText, baseElement } = renderTwoEditors();
    const dataTransfer = createDataTransfer();

    // Drag over the second editor, then end the drag without a drop
    hoverBlock(getByText(paragraphElement1PlainText));
    fireEvent.dragStart(getByLabelText(SELECT_LABEL), { dataTransfer });
    fireEvent.dragOver(getByText(headingElement1PlainText), {
      dataTransfer,
      clientY: 1,
    });
    fireEvent.dragEnd(getByLabelText(SELECT_LABEL), { dataTransfer });

    expect(
      baseElement.querySelector('.editor-block-drop-indicator'),
    ).toBeNull();
  });

  it('does not accept blocks dropped into a read-only editor', async () => {
    const { getByText, getByLabelText, secondValues } = renderTwoEditors(true);
    const dataTransfer = createDataTransfer();

    hoverBlock(getByText(paragraphElement1PlainText));
    fireEvent.dragStart(getByLabelText(SELECT_LABEL), { dataTransfer });
    fireEvent.dragOver(getByText(headingElement1PlainText), { dataTransfer });

    await actFlush(() => {
      fireEvent.drop(getByText(headingElement1PlainText), { dataTransfer });
    });

    // The read-only editor is left untouched
    expect(secondValues).toHaveLength(0);
  });
});

describe('RichTextEditor block selection', () => {
  beforeEach(() => {
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

  // Selects the first block through its handle and dismisses the
  // actions menu which opens along with it
  const selectFirstBlock = async (
    getByText: (text: string) => HTMLElement,
    getByLabelText: (label: string) => HTMLElement,
  ) => {
    hoverBlock(getByText(paragraphElement1PlainText));

    await actFlush(() => {
      fireEvent.click(getByLabelText(SELECT_LABEL));
    });

    await actFlush(() => {
      fireEvent.keyDown(document.body, { key: 'Escape' });
    });
  };

  it('deselects the blocks when pressing outside the editor', async () => {
    const { getByText, getByLabelText, baseElement } = renderEditor();

    await selectFirstBlock(getByText, getByLabelText);

    expect(isSelected(getByText(paragraphElement1PlainText))).toBe(true);

    await actFlush(() => {
      fireEvent.pointerDown(baseElement);
    });

    expect(isSelected(getByText(paragraphElement1PlainText))).toBe(false);
  });

  it('deselects the blocks when pressing in another editor', async () => {
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

    await actFlush(() => {
      fireEvent.keyDown(document.body, { key: 'Escape' });
    });

    await actFlush(() => {
      fireEvent.pointerDown(secondEditorBlock);
    });

    expect(isSelected(firstEditorBlock)).toBe(false);
  });

  it('keeps the selection while pressing the controls', async () => {
    const { getByText, getByLabelText } = renderEditor();

    await selectFirstBlock(getByText, getByLabelText);

    // The controls are still against the block the pointer rests on
    await actFlush(() => {
      fireEvent.pointerDown(getByLabelText(SELECT_LABEL));
    });

    expect(isSelected(getByText(paragraphElement1PlainText))).toBe(true);
  });

  it('keeps the actions menu open when the pointer leaves it', async () => {
    const { getByText, getByLabelText, queryByText } = renderEditor();

    hoverBlock(getByText(paragraphElement1PlainText));

    await actFlush(() => {
      fireEvent.click(getByLabelText(SELECT_LABEL));
    });

    expect(queryByText('Duplicate')).not.toBeNull();

    // The menu never opens from hover, so the pointer leaving the
    // popup must not close it either. The leave is watched for on
    // the positioner, which does not let it bubble.
    await actFlush(() => {
      fireEvent.mouseLeave(
        getByText('Duplicate').closest('.dropdown-menu-positioner')!,
      );
    });

    expect(queryByText('Duplicate')).not.toBeNull();
  });

  it('keeps the selection while the actions menu is open', async () => {
    const { getByText, getByLabelText, baseElement } = renderEditor();

    hoverBlock(getByText(paragraphElement1PlainText));

    // Selecting through the handle opens the actions menu
    await actFlush(() => {
      fireEvent.click(getByLabelText(SELECT_LABEL));
    });

    // An outside press while the menu is open only closes the menu
    await actFlush(() => {
      fireEvent.pointerDown(baseElement);
    });

    expect(isSelected(getByText(paragraphElement1PlainText))).toBe(true);
  });
});
