import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render } from '@minddrop/test-utils';
import { CanvasProvider } from '../CanvasProvider';
import { CanvasStore, createCanvasStore } from '../createCanvasStore';
import { CanvasNodeFrame } from '../types';
import {
  CanvasNodeResizeEdge,
  UseCanvasNodeOptions,
  useCanvasNode,
} from './useCanvasNode';

interface TestNodeProps extends UseCanvasNodeOptions {
  resizeEdge?: CanvasNodeResizeEdge;
}

// Renders a node driven by the hook, exposing its drag handle and
// a single resize handle as test targets
const TestNode: React.FC<TestNodeProps> = ({
  resizeEdge = 'right',
  ...options
}) => {
  const { nodeProps, getDragHandleProps, getResizeHandleProps, wasDragged } =
    useCanvasNode(options);

  return (
    <div {...nodeProps}>
      <div
        data-testid="drag-handle"
        data-was-dragged={wasDragged() ? 'true' : 'false'}
        {...getDragHandleProps()}
      />
      <div data-testid="resize-handle" {...getResizeHandleProps(resizeEdge)} />
    </div>
  );
};

// Renders a node within a canvas provider backed by the given store
const renderNode = (
  store: CanvasStore,
  options: Partial<TestNodeProps> = {},
) => {
  const props: TestNodeProps = {
    id: 'node-1',
    x: 100,
    y: 50,
    width: 300,
    height: 200,
    ...options,
  };

  return render(
    <CanvasProvider store={store}>
      <TestNode {...props} />
    </CanvasProvider>,
  );
};

// Dispatches a window mousemove at the given client position
const moveMouse = (clientX: number, clientY: number, shiftKey = false) => {
  act(() => {
    window.dispatchEvent(
      new MouseEvent('mousemove', { clientX, clientY, shiftKey }),
    );
  });
};

// Dispatches a window mouseup, ending the interaction
const releaseMouse = () => {
  act(() => {
    window.dispatchEvent(new MouseEvent('mouseup'));
  });
};

describe('useCanvasNode', () => {
  afterEach(cleanup);

  it('registers the node frame with the canvas store', () => {
    const store = createCanvasStore();

    renderNode(store);

    expect(store.getNode('node-1')).toEqual({
      x: 100,
      y: 50,
      width: 300,
      height: 200,
    });
  });

  it('unregisters the node on unmount', () => {
    const store = createCanvasStore();

    const { unmount } = renderNode(store);

    unmount();

    expect(store.getNode('node-1')).toBeNull();
  });

  it('drags the node, updating the registered frame', () => {
    const store = createCanvasStore();

    const { getByTestId } = renderNode(store);

    // Drag the handle 40 right, 20 down
    fireEvent.mouseDown(getByTestId('drag-handle'), {
      button: 0,
      clientX: 0,
      clientY: 0,
    });
    moveMouse(40, 20);

    expect(store.getNode('node-1')).toEqual({
      x: 140,
      y: 70,
      width: 300,
      height: 200,
    });
  });

  it('scales drag deltas by the canvas zoom', () => {
    const store = createCanvasStore();

    store.setZoom(2);

    const { getByTestId } = renderNode(store);

    // A 100px screen delta moves the node 50 canvas units at 200%
    fireEvent.mouseDown(getByTestId('drag-handle'), {
      button: 0,
      clientX: 0,
      clientY: 0,
    });
    moveMouse(100, 0);

    expect(store.getNode('node-1')?.x).toBe(150);
  });

  it('reports the rounded frame when a drag ends', () => {
    const store = createCanvasStore();
    let reported: CanvasNodeFrame | null = null;

    const { getByTestId } = renderNode(store, {
      onFrameChange: (frame) => {
        reported = frame;
      },
    });

    fireEvent.mouseDown(getByTestId('drag-handle'), {
      button: 0,
      clientX: 0,
      clientY: 0,
    });
    moveMouse(33, 11);
    releaseMouse();

    expect(reported).toEqual({ x: 133, y: 61, width: 300, height: 200 });
  });

  it('does not report a frame for clicks without movement', () => {
    const store = createCanvasStore();
    let reported: CanvasNodeFrame | null = null;

    const { getByTestId } = renderNode(store, {
      onFrameChange: (frame) => {
        reported = frame;
      },
    });

    // Press and release without moving
    fireEvent.mouseDown(getByTestId('drag-handle'), {
      button: 0,
      clientX: 0,
      clientY: 0,
    });
    releaseMouse();

    expect(reported).toBeNull();
  });

  it('resizes from the right edge, respecting the minimum width', () => {
    const store = createCanvasStore();

    const { getByTestId } = renderNode(store);

    // Shrink well past the minimum width
    fireEvent.mouseDown(getByTestId('resize-handle'), {
      clientX: 0,
      clientY: 0,
    });
    moveMouse(-500, 0);

    expect(store.getNode('node-1')?.width).toBe(200);

    // Grow by 100
    moveMouse(100, 0);

    expect(store.getNode('node-1')?.width).toBe(400);
  });

  it('mirror-resizes from the center with shift held', () => {
    const store = createCanvasStore();

    const { getByTestId } = renderNode(store);

    // Grow the right edge by 50 with shift: width grows by 100,
    // position shifts left by 50 to keep the center fixed
    fireEvent.mouseDown(getByTestId('resize-handle'), {
      clientX: 0,
      clientY: 0,
    });
    moveMouse(50, 0, true);

    expect(store.getNode('node-1')).toEqual({
      x: 50,
      y: 50,
      width: 400,
      height: 200,
    });
  });

  it('resizes from the left edge, anchoring the right edge', () => {
    const store = createCanvasStore();

    const { getByTestId } = renderNode(store, { resizeEdge: 'left' });

    // Move the left edge 50 right: width shrinks, right edge fixed
    fireEvent.mouseDown(getByTestId('resize-handle'), {
      clientX: 0,
      clientY: 0,
    });
    moveMouse(50, 0);

    expect(store.getNode('node-1')).toEqual({
      x: 150,
      y: 50,
      width: 250,
      height: 200,
    });
  });

  it('snaps drags to the grid when snapping is enabled', () => {
    const store = createCanvasStore({ initialSnapToGrid: true });

    const { getByTestId } = renderNode(store);

    // Drag to (140, 70), which snaps to the nearest grid lines
    fireEvent.mouseDown(getByTestId('drag-handle'), {
      button: 0,
      clientX: 0,
      clientY: 0,
    });
    moveMouse(40, 20);

    expect(store.getNode('node-1')).toEqual({
      x: 144,
      y: 72,
      width: 300,
      height: 200,
    });
  });

  it('snaps resized edges to the grid when snapping is enabled', () => {
    const store = createCanvasStore({ initialSnapToGrid: true });

    const { getByTestId } = renderNode(store);

    // Move the right edge from 400 to 410, which snaps back to
    // the grid line at 408
    fireEvent.mouseDown(getByTestId('resize-handle'), {
      clientX: 0,
      clientY: 0,
    });
    moveMouse(10, 0);

    expect(store.getNode('node-1')?.width).toBe(308);
  });

  it('locks text selection during interactions', () => {
    const store = createCanvasStore();

    const { getByTestId } = renderNode(store);

    // Selection locks for the duration of a resize
    fireEvent.mouseDown(getByTestId('resize-handle'), {
      clientX: 0,
      clientY: 0,
    });

    expect(document.body.style.userSelect).toBe('none');

    // The lock lifts when the interaction ends
    releaseMouse();

    expect(document.body.style.userSelect).toBe('');
  });

  it('syncs the frame from updated controlled props', () => {
    const store = createCanvasStore();

    const { rerender } = renderNode(store);

    rerender(
      <CanvasProvider store={store}>
        <TestNode id="node-1" x={500} y={600} width={350} height={250} />
      </CanvasProvider>,
    );

    expect(store.getNode('node-1')).toEqual({
      x: 500,
      y: 600,
      width: 350,
      height: 250,
    });
  });

  it('works without a canvas provider at zoom 1', () => {
    let reported: CanvasNodeFrame | null = null;

    const { getByTestId } = render(
      <TestNode
        id="node-1"
        x={0}
        y={0}
        width={300}
        height={200}
        onFrameChange={(frame) => {
          reported = frame;
        }}
      />,
    );

    // Deltas apply unscaled without a provider
    fireEvent.mouseDown(getByTestId('drag-handle'), {
      button: 0,
      clientX: 0,
      clientY: 0,
    });
    moveMouse(25, 10);
    releaseMouse();

    expect(reported).toEqual({ x: 25, y: 10, width: 300, height: 200 });
  });
});
