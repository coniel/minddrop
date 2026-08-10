import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render } from '@minddrop/test-utils';
import { CanvasProvider } from '../CanvasProvider';
import { CanvasStore, createCanvasStore } from '../createCanvasStore';
import {
  CanvasNodeConnection,
  UseCanvasConnectionDragOptions,
  useCanvasConnectionDrag,
} from './useCanvasConnectionDrag';

// Renders a connection handle for the node's right side, driven
// by the hook
const TestHandles: React.FC<UseCanvasConnectionDragOptions> = (options) => {
  const { getConnectionHandleProps } = useCanvasConnectionDrag(options);

  return (
    <div data-testid="handle-right" {...getConnectionHandleProps('right')} />
  );
};

// Renders the handles within a canvas provider backed by the
// given store, with the source node's frame pre-registered
const renderHandles = (
  store: CanvasStore,
  options: Partial<UseCanvasConnectionDragOptions> = {},
) => {
  store.registerNode('node-1', { x: 0, y: 0, width: 200, height: 100 });

  return render(
    <CanvasProvider store={store}>
      <TestHandles nodeId="node-1" {...options} />
    </CanvasProvider>,
  );
};

// Dispatches a window mousemove at the given client position
const moveMouse = (clientX: number, clientY: number) => {
  act(() => {
    window.dispatchEvent(new MouseEvent('mousemove', { clientX, clientY }));
  });
};

// Dispatches a window mouseup, ending the drag
const releaseMouse = () => {
  act(() => {
    window.dispatchEvent(new MouseEvent('mouseup'));
  });
};

describe('useCanvasConnectionDrag', () => {
  afterEach(cleanup);

  it('starts a connection drag from the pressed side midpoint', () => {
    const store = createCanvasStore();

    const { getByTestId } = renderHandles(store);

    fireEvent.mouseDown(getByTestId('handle-right'), { button: 0 });

    expect(store.getConnectionDrag()).toEqual({
      fromNodeId: 'node-1',
      fromSide: 'right',
      point: { x: 200, y: 50 },
      targetNodeId: null,
      targetSide: null,
      reconnect: null,
    });
  });

  it('ignores non-left button presses', () => {
    const store = createCanvasStore();

    const { getByTestId } = renderHandles(store);

    fireEvent.mouseDown(getByTestId('handle-right'), { button: 2 });

    expect(store.getConnectionDrag()).toBeNull();
  });

  it('tracks the cursor during the drag', () => {
    const store = createCanvasStore();

    const { getByTestId } = renderHandles(store);

    fireEvent.mouseDown(getByTestId('handle-right'), { button: 0 });
    moveMouse(300, 80);

    expect(store.getConnectionDrag()?.point).toEqual({ x: 300, y: 80 });
  });

  it('scales the tracked cursor by the canvas zoom', () => {
    const store = createCanvasStore();

    store.setZoom(2);

    const { getByTestId } = renderHandles(store);

    fireEvent.mouseDown(getByTestId('handle-right'), { button: 0 });
    moveMouse(300, 80);

    expect(store.getConnectionDrag()?.point).toEqual({ x: 150, y: 40 });
  });

  it('reports the connection when dropped on a target', () => {
    const store = createCanvasStore();
    let connected: CanvasNodeConnection | null = null;

    const { getByTestId } = renderHandles(store, {
      onConnect: (connection) => {
        connected = connection;
      },
    });

    fireEvent.mouseDown(getByTestId('handle-right'), { button: 0 });

    // Set a target directly, standing in for a second node's frame
    act(() => {
      store.updateConnectionDrag(
        { x: 400, y: 50 },
        { nodeId: 'node-2', side: 'left' },
      );
    });

    releaseMouse();

    expect(connected).toEqual({
      from: { nodeId: 'node-1', side: 'right' },
      to: { nodeId: 'node-2', side: 'left' },
    });
    expect(store.getConnectionDrag()).toBeNull();
  });

  it('snaps to nodes near the cursor as the drag target', () => {
    const store = createCanvasStore();

    const { getByTestId } = renderHandles(store);

    store.registerNode('node-2', { x: 400, y: 0, width: 200, height: 100 });

    fireEvent.mouseDown(getByTestId('handle-right'), { button: 0 });

    // 10px from node-2's left edge, without touching it
    moveMouse(390, 50);

    expect(store.getConnectionDrag()?.targetNodeId).toBe('node-2');
    expect(store.getConnectionDrag()?.targetSide).toBe('left');
  });

  it('does not report a connection when dropped off-target', () => {
    const store = createCanvasStore();
    let connected: CanvasNodeConnection | null = null;

    const { getByTestId } = renderHandles(store, {
      onConnect: (connection) => {
        connected = connection;
      },
    });

    fireEvent.mouseDown(getByTestId('handle-right'), { button: 0 });
    moveMouse(400, 50);
    releaseMouse();

    expect(connected).toBeNull();
    expect(store.getConnectionDrag()).toBeNull();
  });

  it('cancels the drag on Escape', () => {
    const store = createCanvasStore();

    const { getByTestId } = renderHandles(store);

    fireEvent.mouseDown(getByTestId('handle-right'), { button: 0 });

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(store.getConnectionDrag()).toBeNull();
  });

  it('locks text selection during the drag', () => {
    const store = createCanvasStore();

    const { getByTestId } = renderHandles(store);

    fireEvent.mouseDown(getByTestId('handle-right'), { button: 0 });

    expect(document.body.style.userSelect).toBe('none');

    releaseMouse();

    expect(document.body.style.userSelect).toBe('');
  });
});
