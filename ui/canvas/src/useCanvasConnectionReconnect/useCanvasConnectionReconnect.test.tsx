import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render } from '@minddrop/test-utils';
import { CanvasProvider } from '../CanvasProvider';
import { CanvasStore, createCanvasStore } from '../createCanvasStore';
import { CanvasConnection } from '../types';
import {
  CanvasConnectionReconnection,
  UseCanvasConnectionReconnectOptions,
  useCanvasConnectionReconnect,
} from './useCanvasConnectionReconnect';

const connection: CanvasConnection = {
  id: 'connection-1',
  from: { nodeId: 'node-1', side: 'right' },
  to: { nodeId: 'node-2', side: 'left' },
};

// Renders a connection hit area driven by the hook
const TestHitArea: React.FC<UseCanvasConnectionReconnectOptions> = (
  options,
) => {
  const { getConnectionProps } = useCanvasConnectionReconnect(options);

  return <div data-testid="hit-area" {...getConnectionProps(connection)} />;
};

// Renders the hit area within a canvas provider backed by the
// given store, with both endpoint node frames pre-registered
const renderHitArea = (
  store: CanvasStore,
  options: Partial<UseCanvasConnectionReconnectOptions> = {},
) => {
  store.registerNode('node-1', { x: 0, y: 0, width: 200, height: 100 });
  store.registerNode('node-2', { x: 400, y: 0, width: 200, height: 100 });

  return render(
    <CanvasProvider store={store}>
      <TestHitArea {...options} />
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

describe('useCanvasConnectionReconnect', () => {
  afterEach(cleanup);

  it('does not start a drag within the click threshold', () => {
    const store = createCanvasStore();

    const { getByTestId } = renderHitArea(store);

    fireEvent.mouseDown(getByTestId('hit-area'), {
      button: 0,
      clientX: 380,
      clientY: 50,
    });
    moveMouse(382, 50);

    expect(store.getConnectionDrag()).toBeNull();
  });

  it('starts a drag detaching the end nearest the grab point', () => {
    const store = createCanvasStore();

    const { getByTestId } = renderHitArea(store);

    // Grab near the connection's target end
    fireEvent.mouseDown(getByTestId('hit-area'), {
      button: 0,
      clientX: 380,
      clientY: 50,
    });
    moveMouse(300, 160);

    // The drag is anchored to the source end, re-routing the
    // target end
    expect(store.getConnectionDrag()).toEqual({
      fromNodeId: 'node-1',
      fromSide: 'right',
      point: { x: 300, y: 160 },
      targetNodeId: null,
      targetSide: null,
      reconnect: { connectionId: 'connection-1', end: 'to' },
    });
  });

  it('snaps to nodes near the cursor as the drag target', () => {
    const store = createCanvasStore();

    const { getByTestId } = renderHitArea(store);

    fireEvent.mouseDown(getByTestId('hit-area'), {
      button: 0,
      clientX: 380,
      clientY: 50,
    });

    // 10px from node-2's left edge, without touching it
    moveMouse(390, 60);

    expect(store.getConnectionDrag()?.targetNodeId).toBe('node-2');
    expect(store.getConnectionDrag()?.targetSide).toBe('left');
  });

  it('detaches the source end when grabbed nearer to it', () => {
    const store = createCanvasStore();

    const { getByTestId } = renderHitArea(store);

    // Grab near the connection's source end
    fireEvent.mouseDown(getByTestId('hit-area'), {
      button: 0,
      clientX: 210,
      clientY: 50,
    });
    moveMouse(220, 60);

    // The drag is anchored to the target end, re-routing the
    // source end
    expect(store.getConnectionDrag()?.fromNodeId).toBe('node-2');
    expect(store.getConnectionDrag()?.fromSide).toBe('left');
    expect(store.getConnectionDrag()?.reconnect).toEqual({
      connectionId: 'connection-1',
      end: 'from',
    });
  });

  it('ignores non-left button presses', () => {
    const store = createCanvasStore();

    const { getByTestId } = renderHitArea(store);

    fireEvent.mouseDown(getByTestId('hit-area'), {
      button: 2,
      clientX: 380,
      clientY: 50,
    });
    moveMouse(390, 60);

    expect(store.getConnectionDrag()).toBeNull();
  });

  it('reports the re-connection when dropped on a target', () => {
    const store = createCanvasStore();
    let reconnected: CanvasConnectionReconnection | null = null;

    const { getByTestId } = renderHitArea(store, {
      onReconnect: (reconnection) => {
        reconnected = reconnection;
      },
    });

    fireEvent.mouseDown(getByTestId('hit-area'), {
      button: 0,
      clientX: 380,
      clientY: 50,
    });
    moveMouse(390, 60);

    // Set a target directly, standing in for a third node's frame
    act(() => {
      store.updateConnectionDrag(
        { x: 400, y: 250 },
        { nodeId: 'node-3', side: 'top' },
      );
    });

    releaseMouse();

    expect(reconnected).toEqual({
      connectionId: 'connection-1',
      end: 'to',
      target: { nodeId: 'node-3', side: 'top' },
    });
    expect(store.getConnectionDrag()).toBeNull();
  });

  it('reports a null target when dropped on empty canvas', () => {
    const store = createCanvasStore();
    let reconnected: CanvasConnectionReconnection | null = null;

    const { getByTestId } = renderHitArea(store, {
      onReconnect: (reconnection) => {
        reconnected = reconnection;
      },
    });

    fireEvent.mouseDown(getByTestId('hit-area'), {
      button: 0,
      clientX: 380,
      clientY: 50,
    });
    moveMouse(300, 160);
    releaseMouse();

    expect(reconnected).toEqual({
      connectionId: 'connection-1',
      end: 'to',
      target: null,
    });
    expect(store.getConnectionDrag()).toBeNull();
  });

  it('does not report a re-connection for plain clicks', () => {
    const store = createCanvasStore();
    let reconnected: CanvasConnectionReconnection | null = null;

    const { getByTestId } = renderHitArea(store, {
      onReconnect: (reconnection) => {
        reconnected = reconnection;
      },
    });

    fireEvent.mouseDown(getByTestId('hit-area'), {
      button: 0,
      clientX: 380,
      clientY: 50,
    });
    releaseMouse();

    expect(reconnected).toBeNull();
    expect(store.getConnectionDrag()).toBeNull();
  });

  it('cancels the drag on Escape', () => {
    const store = createCanvasStore();

    const { getByTestId } = renderHitArea(store);

    fireEvent.mouseDown(getByTestId('hit-area'), {
      button: 0,
      clientX: 380,
      clientY: 50,
    });
    moveMouse(390, 60);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(store.getConnectionDrag()).toBeNull();
  });

  it('locks text selection and the cursor during the drag', () => {
    const store = createCanvasStore();

    const { getByTestId } = renderHitArea(store);

    fireEvent.mouseDown(getByTestId('hit-area'), {
      button: 0,
      clientX: 380,
      clientY: 50,
    });
    moveMouse(390, 60);

    expect(document.body.style.userSelect).toBe('none');
    expect(document.body.style.cursor).toBe('grabbing');

    releaseMouse();

    expect(document.body.style.userSelect).toBe('');
    expect(document.body.style.cursor).toBe('');
  });
});
