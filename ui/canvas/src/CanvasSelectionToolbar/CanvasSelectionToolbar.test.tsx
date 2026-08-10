import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render } from '@minddrop/test-utils';
import { CanvasNode } from '../CanvasNode';
import { CanvasProvider } from '../CanvasProvider';
import { CanvasStore, createCanvasStore } from '../createCanvasStore';
import { CanvasSelection } from '../types';
import { CanvasSelectionToolbar } from './CanvasSelectionToolbar';

// Reports which selection the toolbar was rendered for
const renderToolbarContents = (selection: CanvasSelection) => (
  <div data-testid="toolbar-contents">
    {selection.type}:{selection.ids.join(',')}
  </div>
);

// Renders the toolbar alongside two mounted nodes, within a
// canvas provider backed by the given store
const renderToolbar = (store: CanvasStore) => {
  const result = render(
    <CanvasProvider store={store}>
      <CanvasNode id="node-1" x={0} y={0} width={100} height={100}>
        node-1
      </CanvasNode>
      <CanvasNode id="node-2" x={300} y={50} width={100} height={100}>
        node-2
      </CanvasNode>
      <CanvasSelectionToolbar renderToolbar={renderToolbarContents} />
    </CanvasProvider>,
  );

  return {
    ...result,
    toolbar: () =>
      result.container.querySelector<HTMLElement>(
        '.ui-canvas-selection-toolbar',
      ),
  };
};

describe('CanvasSelectionToolbar', () => {
  afterEach(cleanup);

  it('renders nothing when nothing is selected', () => {
    const store = createCanvasStore();

    const { toolbar } = renderToolbar(store);

    expect(toolbar()).toBeNull();
  });

  it('floats above a single selected node', () => {
    const store = createCanvasStore();

    const { toolbar, getByTestId } = renderToolbar(store);

    act(() => {
      store.selectNodes(['node-1']);
    });

    expect(getByTestId('toolbar-contents').textContent).toBe('nodes:node-1');

    // Centered on the node's top edge, one gap above it
    expect(toolbar()?.style.left).toBe('50px');
    expect(toolbar()?.style.top).toBe('-12px');
  });

  it('floats above a multi-node selection, clearing the box padding', () => {
    const store = createCanvasStore();

    const { toolbar } = renderToolbar(store);

    act(() => {
      store.selectNodes(['node-1', 'node-2']);
    });

    // The union runs 0,0 to 400,150, and the gap is measured
    // from the box's padded edge rather than the nodes
    expect(toolbar()?.style.left).toBe('200px');
    expect(toolbar()?.style.top).toBe('-20px');
  });

  it('floats above a connection selection using the registered geometry', () => {
    const store = createCanvasStore();

    const { toolbar, getByTestId } = renderToolbar(store);

    act(() => {
      store.setConnectionGeometry({
        hitTest: () => [],
        getBounds: () => ({ x: 100, y: 40, width: 200, height: 20 }),
      });
      store.selectConnections(['connection-1']);
    });

    expect(getByTestId('toolbar-contents').textContent).toBe(
      'connections:connection-1',
    );
    expect(toolbar()?.style.left).toBe('200px');
    expect(toolbar()?.style.top).toBe('28px');
  });

  it('renders nothing for a connection selection with no geometry', () => {
    const store = createCanvasStore();

    const { toolbar } = renderToolbar(store);

    act(() => {
      store.selectConnections(['connection-1']);
    });

    expect(toolbar()).toBeNull();
  });

  it('renders nothing when no selected node is mounted', () => {
    const store = createCanvasStore();

    const { toolbar } = renderToolbar(store);

    act(() => {
      store.selectNodes(['never-mounted']);
    });

    expect(toolbar()).toBeNull();
  });

  it('tracks the canvas pan and zoom', () => {
    const store = createCanvasStore();

    const { toolbar } = renderToolbar(store);

    act(() => {
      store.selectNodes(['node-1']);
      store.setZoom(2);
      store.setPan(30, 40);
    });

    // The node's top center at 50,0 scaled and panned
    expect(toolbar()?.style.left).toBe('130px');
    expect(toolbar()?.style.top).toBe('28px');
  });

  it('hides while a drag is in progress', () => {
    const store = createCanvasStore();

    const { toolbar, container } = renderToolbar(store);

    act(() => {
      store.selectNodes(['node-1']);
    });

    expect(toolbar()).not.toBeNull();

    // Dragging the node holds the interaction lock
    fireEvent.mouseDown(container.querySelector('.ui-canvas-node')!, {
      button: 0,
      clientX: 0,
      clientY: 0,
    });

    expect(toolbar()).toBeNull();

    act(() => {
      window.dispatchEvent(new MouseEvent('mouseup'));
    });

    expect(toolbar()).not.toBeNull();
  });
});
