import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { fireEvent, render } from '@minddrop/test-utils';
import { cleanup, paragraphElement1 } from '../test-utils';
import { HoveredBlock } from '../useHoveredBlock';
import { BlockGutter, BlockInsertPosition } from './BlockGutter';

// A hovered block positioned part way down the viewport
const hoveredBlock: HoveredBlock = {
  element: paragraphElement1,
  path: [0],
  top: 40,
  left: 120,
  lineHeight: 24,
};

describe('BlockGutter', () => {
  afterEach(cleanup);

  it('renders nothing when no block is hovered', () => {
    const { queryByRole } = render(
      <BlockGutter
        block={null}
        controlsRef={createRef()}
        onInsert={() => undefined}
        onSelect={() => undefined}
      />,
    );

    expect(queryByRole('button')).toBeNull();
  });

  it('renders the controls outside the editor', () => {
    const { container, baseElement } = render(
      <BlockGutter
        block={hoveredBlock}
        controlsRef={createRef()}
        onInsert={() => undefined}
        onSelect={() => undefined}
      />,
    );

    // Portalled out so that ancestors clipping the editor, such as
    // a card, cannot clip the controls
    expect(container.firstChild).toBeNull();
    expect(baseElement.querySelector('.editor-block-gutter')).not.toBeNull();
  });

  it('aligns the controls with the hovered block', () => {
    const controlsRef = createRef<HTMLDivElement>();

    render(
      <BlockGutter
        block={hoveredBlock}
        controlsRef={controlsRef}
        onInsert={() => undefined}
        onSelect={() => undefined}
      />,
    );

    expect(controlsRef.current?.style.top).toBe('40px');
    expect(controlsRef.current?.style.left).toBe('120px');
    expect(controlsRef.current?.style.height).toBe('24px');
  });

  it('inserts below when the insert button is clicked', () => {
    // Positions collected from the callback
    const positions: BlockInsertPosition[] = [];

    const { getByLabelText } = render(
      <BlockGutter
        block={hoveredBlock}
        controlsRef={createRef()}
        onInsert={(position) => positions.push(position)}
        onSelect={() => undefined}
      />,
    );

    fireEvent.click(getByLabelText('Insert block'));

    expect(positions).toEqual(['below']);
  });

  it('inserts above when the insert button is shift clicked', () => {
    // Positions collected from the callback
    const positions: BlockInsertPosition[] = [];

    const { getByLabelText } = render(
      <BlockGutter
        block={hoveredBlock}
        controlsRef={createRef()}
        onInsert={(position) => positions.push(position)}
        onSelect={() => undefined}
      />,
    );

    fireEvent.click(getByLabelText('Insert block'), { shiftKey: true });

    expect(positions).toEqual(['above']);
  });

  it('selects the block when the handle is clicked', () => {
    // Whether the selection was extended, collected from the callback
    const extended: boolean[] = [];

    const { getByLabelText } = render(
      <BlockGutter
        block={hoveredBlock}
        controlsRef={createRef()}
        onInsert={() => undefined}
        onSelect={(extend) => extended.push(extend)}
      />,
    );

    fireEvent.click(getByLabelText('Select block'));

    expect(extended).toEqual([false]);
  });

  it('extends the selection when the handle is shift clicked', () => {
    // Whether the selection was extended, collected from the callback
    const extended: boolean[] = [];

    const { getByLabelText } = render(
      <BlockGutter
        block={hoveredBlock}
        controlsRef={createRef()}
        onInsert={() => undefined}
        onSelect={(extend) => extended.push(extend)}
      />,
    );

    fireEvent.click(getByLabelText('Select block'), { shiftKey: true });

    expect(extended).toEqual([true]);
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
        <BlockGutter
          block={hoveredBlock}
          controlsRef={createRef()}
          onInsert={() => undefined}
          onSelect={() => undefined}
        />
      </div>,
    );

    fireEvent.mouseDown(getByLabelText('Insert block'));
    fireEvent.click(getByLabelText('Insert block'));

    expect(surroundingEvents).toEqual([]);
  });
});
