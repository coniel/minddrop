import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DragAndDrop } from '@minddrop/drag-and-drop';
import {
  cleanup as cleanupDragAndDrop,
  dragOver,
  setup as setupDragAndDrop,
} from '@minddrop/drag-and-drop/test-utils';
import { fireEvent, render } from '@minddrop/test-utils';
import { cleanup, paragraphElement1 } from '../test-utils';
import { HoveredBlock } from '../useHoveredBlock';
import {
  BlockGutter,
  BlockGutterProps,
  BlockInsertPosition,
} from './BlockGutter';

// A hovered block positioned part way down the viewport
const hoveredBlock: HoveredBlock = {
  element: paragraphElement1,
  path: [0],
  top: 40,
  left: 120,
  lineHeight: 24,
};

/**
 * Renders the gutter for the hovered block with a draggable handle.
 */
const Gutter: React.FC<Partial<BlockGutterProps>> = (props) => {
  const { draggableProps } = DragAndDrop.useDraggable({
    id: 'block',
    type: 'block',
    data: { block: [paragraphElement1] },
  });

  return (
    <BlockGutter
      block={hoveredBlock}
      controlsRef={createRef()}
      handleRef={createRef()}
      onInsert={() => undefined}
      onSelect={() => undefined}
      dragHandleProps={draggableProps}
      {...props}
    />
  );
};

function renderGutter(props: Partial<BlockGutterProps> = {}) {
  return render(<Gutter {...props} />);
}

describe('BlockGutter', () => {
  beforeEach(setupDragAndDrop);

  afterEach(() => {
    cleanup();
    cleanupDragAndDrop();
  });

  it('renders nothing when no block is hovered', () => {
    const { queryByRole } = renderGutter({ block: null });

    expect(queryByRole('button')).toBeNull();
  });

  it('renders the controls outside the editor', () => {
    const { container, baseElement } = renderGutter();

    // Portalled out so that ancestors clipping the editor, such as
    // a card, cannot clip the controls.
    expect(container.firstChild).toBeNull();
    expect(baseElement.querySelector('.editor-block-gutter')).not.toBeNull();
  });

  it('aligns the controls with the hovered block', () => {
    const controlsRef = createRef<HTMLDivElement>();

    renderGutter({ controlsRef });

    expect(controlsRef.current?.style.top).toBe('40px');
    expect(controlsRef.current?.style.left).toBe('120px');
    expect(controlsRef.current?.style.height).toBe('24px');
  });

  it('inserts below when the insert button is clicked', () => {
    // Positions collected from the callback
    const positions: BlockInsertPosition[] = [];

    const { getByLabelText } = renderGutter({
      onInsert: (position) => positions.push(position),
    });

    fireEvent.click(getByLabelText('Insert block'));

    expect(positions).toEqual(['below']);
  });

  it('inserts above when the insert button is shift clicked', () => {
    // Positions collected from the callback
    const positions: BlockInsertPosition[] = [];

    const { getByLabelText } = renderGutter({
      onInsert: (position) => positions.push(position),
    });

    fireEvent.click(getByLabelText('Insert block'), { shiftKey: true });

    expect(positions).toEqual(['above']);
  });

  it('selects the block when the handle is clicked', () => {
    // Whether the selection was extended, collected from the callback
    const extended: boolean[] = [];

    const { getByLabelText } = renderGutter({
      onSelect: (extend) => extended.push(extend),
    });

    fireEvent.click(getByLabelText('Select block'));

    expect(extended).toEqual([false]);
  });

  it('extends the selection when the handle is shift clicked', () => {
    // Whether the selection was extended, collected from the callback
    const extended: boolean[] = [];

    const { getByLabelText } = renderGutter({
      onSelect: (extend) => extended.push(extend),
    });

    fireEvent.click(getByLabelText('Select block'), { shiftKey: true });

    expect(extended).toEqual([true]);
  });

  it('drags the block by its handle', () => {
    const { getByLabelText } = renderGutter();

    dragOver(getByLabelText('Select block'), document.body);

    expect(DragAndDrop.getActiveDrag()).toEqual(
      expect.objectContaining({
        data: {
          block: [paragraphElement1],
        },
      }),
    );
  });

  it('registers the handle on the menu ref alongside the drag ref', () => {
    const handleRef = createRef<HTMLButtonElement>();

    const { getByLabelText } = renderGutter({ handleRef });

    // Check both refs resolve to the handle, since it is the drag
    // handle as well.
    expect(handleRef.current).toBe(getByLabelText('Select block'));
  });

  it('does not let its events reach handlers around the editor', () => {
    // Events which reached the surrounding element
    const surroundingEvents: string[] = [];

    // Portalled events still travel up the React tree, so the
    // surrounding handlers are reached despite the portal.
    const { getByLabelText } = render(
      <div
        onClick={() => surroundingEvents.push('click')}
        onMouseDown={() => surroundingEvents.push('mousedown')}
      >
        <Gutter />
      </div>,
    );

    fireEvent.mouseDown(getByLabelText('Insert block'));
    fireEvent.click(getByLabelText('Insert block'));

    expect(surroundingEvents).toEqual([]);
  });
});
