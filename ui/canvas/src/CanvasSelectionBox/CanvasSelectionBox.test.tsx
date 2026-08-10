import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render } from '@minddrop/test-utils';
import { CanvasNode } from '../CanvasNode';
import { CanvasProvider } from '../CanvasProvider';
import { CanvasStore, createCanvasStore } from '../createCanvasStore';
import { CanvasNodeFrame } from '../types';
import { CanvasSelectionBox } from './CanvasSelectionBox';

interface RenderOptions {
  /**
   * The nodes to mount, keyed by ID. Real nodes are mounted
   * rather than frames registered directly, since applying the
   * group offset is the node's own job.
   */
  nodes?: Record<string, CanvasNodeFrame>;

  onNodesFrameChange?: (frames: Record<string, CanvasNodeFrame>) => void;
}

const defaultNodes: Record<string, CanvasNodeFrame> = {
  'node-1': { x: 0, y: 0, width: 100, height: 100 },
  'node-2': { x: 300, y: 50, width: 100, height: 100 },
};

// Renders the box alongside mounted nodes, within a canvas
// provider backed by the given store
const renderBox = (store: CanvasStore, options: RenderOptions = {}) => {
  const { nodes = defaultNodes, onNodesFrameChange } = options;

  const result = render(
    <CanvasProvider store={store}>
      {Object.entries(nodes).map(([id, frame]) => (
        <CanvasNode key={id} id={id} {...frame}>
          {id}
        </CanvasNode>
      ))}
      <CanvasSelectionBox onNodesFrameChange={onNodesFrameChange} />
    </CanvasProvider>,
  );

  return {
    ...result,
    box: () =>
      result.container.querySelector<HTMLElement>('.ui-canvas-selection-box'),
  };
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

describe('CanvasSelectionBox', () => {
  afterEach(cleanup);

  it('renders nothing when nothing is selected', () => {
    const store = createCanvasStore();

    const { box } = renderBox(store);

    expect(box()).toBeNull();
  });

  it('renders nothing for a single selected node', () => {
    const store = createCanvasStore();

    const { box } = renderBox(store);

    act(() => {
      store.selectNodes(['node-1']);
    });

    // A single node keeps its own outline and handles
    expect(box()).toBeNull();
  });

  it('renders nothing for a connection selection', () => {
    const store = createCanvasStore();

    const { box } = renderBox(store);

    act(() => {
      store.selectConnections(['connection-1', 'connection-2']);
    });

    expect(box()).toBeNull();
  });

  it('wraps the selected nodes in their padded union bounds', () => {
    const store = createCanvasStore();

    const { box } = renderBox(store);

    act(() => {
      store.selectNodes(['node-1', 'node-2']);
    });

    // The union runs 0,0 to 400,150, inflated by 8 all round
    expect(box()?.style.transform).toBe('translate(-8px, -8px)');
    expect(box()?.style.width).toBe('416px');
    expect(box()?.style.height).toBe('166px');
  });

  it('skips selected nodes that are not mounted', () => {
    const store = createCanvasStore();

    const { box } = renderBox(store, {
      nodes: { 'node-1': defaultNodes['node-1'] },
    });

    act(() => {
      store.selectNodes(['node-1', 'never-mounted']);
    });

    expect(box()?.style.width).toBe('116px');
  });

  it('moves every selected node by the drag offset', () => {
    const store = createCanvasStore();

    const { box } = renderBox(store);

    act(() => {
      store.selectNodes(['node-1', 'node-2']);
    });

    fireEvent.mouseDown(box()!, { button: 0, clientX: 0, clientY: 0 });
    moveMouse(40, 20);

    expect(store.getSelectionDrag()).toEqual({ x: 40, y: 20 });
    expect(store.getNode('node-1')).toEqual({
      x: 40,
      y: 20,
      width: 100,
      height: 100,
    });
    expect(store.getNode('node-2')).toEqual({
      x: 340,
      y: 70,
      width: 100,
      height: 100,
    });

    releaseMouse();
  });

  it('leaves unselected nodes where they are', () => {
    const store = createCanvasStore();

    const { box } = renderBox(store, {
      nodes: {
        ...defaultNodes,
        'node-3': { x: 600, y: 0, width: 100, height: 100 },
      },
    });

    act(() => {
      store.selectNodes(['node-1', 'node-2']);
    });

    fireEvent.mouseDown(box()!, { button: 0, clientX: 0, clientY: 0 });
    moveMouse(40, 20);

    expect(store.getNode('node-3')).toEqual({
      x: 600,
      y: 0,
      width: 100,
      height: 100,
    });

    releaseMouse();
  });

  it('follows the drag with its own bounds', () => {
    const store = createCanvasStore();

    const { box } = renderBox(store);

    act(() => {
      store.selectNodes(['node-1', 'node-2']);
    });

    fireEvent.mouseDown(box()!, { button: 0, clientX: 0, clientY: 0 });
    moveMouse(40, 20);

    expect(box()?.style.transform).toBe('translate(32px, 12px)');

    releaseMouse();
  });

  it('scales the drag offset by the canvas zoom', () => {
    const store = createCanvasStore({ initialZoom: 2 });

    const { box } = renderBox(store);

    act(() => {
      store.selectNodes(['node-1', 'node-2']);
    });

    fireEvent.mouseDown(box()!, { button: 0, clientX: 0, clientY: 0 });
    moveMouse(40, 20);

    expect(store.getSelectionDrag()).toEqual({ x: 20, y: 10 });

    releaseMouse();
  });

  it('snaps the bounds origin to the grid', () => {
    const store = createCanvasStore({ initialSnapToGrid: true });

    const { box } = renderBox(store);

    act(() => {
      store.selectNodes(['node-1', 'node-2']);
    });

    // The bounds start at x 0, so a 30px move snaps to the 24px
    // grid line rather than landing at 30
    fireEvent.mouseDown(box()!, { button: 0, clientX: 0, clientY: 0 });
    moveMouse(30, 30);

    expect(store.getSelectionDrag()).toEqual({ x: 24, y: 24 });

    releaseMouse();
  });

  it('reports every moved node in one call on release', () => {
    const store = createCanvasStore();
    const reported: Record<string, CanvasNodeFrame>[] = [];

    const { box } = renderBox(store, {
      onNodesFrameChange: (frames) => {
        reported.push(frames);
      },
    });

    act(() => {
      store.selectNodes(['node-1', 'node-2']);
    });

    fireEvent.mouseDown(box()!, { button: 0, clientX: 0, clientY: 0 });
    moveMouse(40, 20);
    releaseMouse();

    expect(reported).toEqual([
      {
        'node-1': { x: 40, y: 20, width: 100, height: 100 },
        'node-2': { x: 340, y: 70, width: 100, height: 100 },
      },
    ]);
  });

  it('clears the drag offset on release', () => {
    const store = createCanvasStore();

    const { box } = renderBox(store);

    act(() => {
      store.selectNodes(['node-1', 'node-2']);
    });

    fireEvent.mouseDown(box()!, { button: 0, clientX: 0, clientY: 0 });
    moveMouse(40, 20);
    releaseMouse();

    expect(store.getSelectionDrag()).toBeNull();
  });

  it('locks the pointer for the duration of the drag', () => {
    const store = createCanvasStore();

    const { box } = renderBox(store);

    act(() => {
      store.selectNodes(['node-1', 'node-2']);
    });

    const allowed = fireEvent.mouseDown(box()!, {
      button: 0,
      clientX: 0,
      clientY: 0,
    });

    // The press suppresses the text selection it would start
    expect(allowed).toBe(false);
    expect(document.body.classList.contains('ui-canvas-interacting')).toBe(
      true,
    );

    releaseMouse();

    expect(document.body.classList.contains('ui-canvas-interacting')).toBe(
      false,
    );
  });

  it('ignores non-left button presses', () => {
    const store = createCanvasStore();

    const { box } = renderBox(store);

    act(() => {
      store.selectNodes(['node-1', 'node-2']);
    });

    fireEvent.mouseDown(box()!, { button: 2, clientX: 0, clientY: 0 });

    expect(store.getSelectionDrag()).toBeNull();
  });
});
