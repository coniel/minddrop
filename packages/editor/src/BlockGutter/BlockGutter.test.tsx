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
      />,
    );

    expect(controlsRef.current?.style.top).toBe('40px');
    expect(controlsRef.current?.style.left).toBe('120px');
    expect(controlsRef.current?.style.height).toBe('24px');
  });

  it('inserts below when the insert button is clicked', () => {
    // Positions collected from the callback
    const positions: BlockInsertPosition[] = [];

    const { getByRole } = render(
      <BlockGutter
        block={hoveredBlock}
        controlsRef={createRef()}
        onInsert={(position) => positions.push(position)}
      />,
    );

    fireEvent.click(getByRole('button'));

    expect(positions).toEqual(['below']);
  });

  it('inserts above when the insert button is shift clicked', () => {
    // Positions collected from the callback
    const positions: BlockInsertPosition[] = [];

    const { getByRole } = render(
      <BlockGutter
        block={hoveredBlock}
        controlsRef={createRef()}
        onInsert={(position) => positions.push(position)}
      />,
    );

    fireEvent.click(getByRole('button'), { shiftKey: true });

    expect(positions).toEqual(['above']);
  });

  it('does not let its events reach handlers around the editor', () => {
    // Events which reached the surrounding element
    const surroundingEvents: string[] = [];

    // Portalled events still travel up the React tree, so the
    // surrounding handlers are reached despite the portal.
    const { getByRole } = render(
      <div
        onClick={() => surroundingEvents.push('click')}
        onMouseDown={() => surroundingEvents.push('mousedown')}
      >
        <BlockGutter
          block={hoveredBlock}
          controlsRef={createRef()}
          onInsert={() => undefined}
        />
      </div>,
    );

    fireEvent.mouseDown(getByRole('button'));
    fireEvent.click(getByRole('button'));

    expect(surroundingEvents).toEqual([]);
  });
});
