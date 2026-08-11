import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render } from '@minddrop/test-utils';
import { CanvasProvider } from '../CanvasProvider';
import { CanvasStore, createCanvasStore } from '../createCanvasStore';
import { CanvasConnection } from '../types';
import {
  CanvasConnectionsLayer,
  CanvasConnectionsLayerProps,
} from './CanvasConnectionsLayer';

const connection: CanvasConnection = {
  id: 'connection-1',
  from: { nodeId: 'node-1', side: 'right' },
  to: { nodeId: 'node-2', side: 'left' },
};

// Renders the layer within a canvas provider backed by the given
// store, with both endpoint node frames pre-registered
const renderLayer = (
  store: CanvasStore,
  props: Partial<CanvasConnectionsLayerProps> = {},
) => {
  store.registerNode('node-1', { x: 0, y: 0, width: 200, height: 100 });
  store.registerNode('node-2', { x: 400, y: 0, width: 200, height: 100 });

  return render(
    <CanvasProvider store={store}>
      <CanvasConnectionsLayer connections={[connection]} {...props} />
    </CanvasProvider>,
  );
};

describe('CanvasConnectionsLayer', () => {
  afterEach(cleanup);

  it('renders a curve between the connected node sides', () => {
    const store = createCanvasStore();

    const { container } = renderLayer(store);

    const line = container.querySelector('.ui-canvas-connection-line');

    // The curve runs from node-1's right midpoint toward node-2's
    // left midpoint, ending behind the arrowhead
    expect(line?.getAttribute('d')).toBe('M 200 50 C 300 50, 300 50, 389 50');
  });

  it('tracks node frames from the registry', () => {
    const store = createCanvasStore();

    const { container } = renderLayer(store);

    // Move the source node down
    act(() => {
      store.updateNodeFrame('node-1', { y: 100 });
    });

    const line = container.querySelector('.ui-canvas-connection-line');

    // The curve starts from the moved frame's right midpoint
    expect(line?.getAttribute('d')).toMatch(/^M 200 150 C .* 389 50$/);
  });

  it('skips connections to unregistered nodes', () => {
    const store = createCanvasStore();

    const { container } = renderLayer(store, {
      connections: [
        connection,
        {
          id: 'connection-2',
          from: { nodeId: 'node-1', side: 'bottom' },
          to: { nodeId: 'missing', side: 'top' },
        },
      ],
    });

    expect(container.querySelectorAll('.ui-canvas-connection').length).toBe(1);
  });

  it('marks the selected connection', () => {
    const store = createCanvasStore();

    const { container } = renderLayer(store);

    act(() => {
      store.selectConnections(['connection-1']);
    });

    expect(
      container.querySelector('.ui-canvas-connection-selected'),
    ).not.toBeNull();
  });

  it('does not mark connections for a node selection', () => {
    const store = createCanvasStore();

    const { container } = renderLayer(store);

    act(() => {
      store.selectNodes(['connection-1']);
    });

    expect(
      container.querySelector('.ui-canvas-connection-selected'),
    ).toBeNull();
  });

  it('applies the configured stroke styling', () => {
    const store = createCanvasStore();

    const { container } = renderLayer(store, {
      connections: [
        { ...connection, color: 'blue', style: 'dashed', thickness: 'thick' },
      ],
    });

    const line = container.querySelector('.ui-canvas-connection-line');
    const style = line?.getAttribute('style') || '';

    expect(style).toContain('stroke: var(--blue-600)');
    expect(style).toContain('stroke-width: 4');
    expect(style).toContain('stroke-dasharray: 16 12');
  });

  it('renders arrowhead markers for each color and thickness in use', () => {
    const store = createCanvasStore();

    const { container } = renderLayer(store, {
      connections: [
        connection,
        {
          id: 'connection-2',
          from: { nodeId: 'node-1', side: 'top' },
          to: { nodeId: 'node-2', side: 'top' },
          color: 'red',
        },
        {
          id: 'connection-3',
          from: { nodeId: 'node-1', side: 'bottom' },
          to: { nodeId: 'node-2', side: 'bottom' },
          color: 'red',
          thickness: 'thick',
        },
      ],
    });

    const markers = container.querySelectorAll('marker');

    // Default/medium, red/medium and red/thick
    expect(markers.length).toBe(3);
  });

  it('selects a clicked connection', () => {
    const store = createCanvasStore();

    const { container } = renderLayer(store);

    const hitArea = container.querySelector('.ui-canvas-connection-hit-area');

    fireEvent.mouseDown(hitArea!, { button: 0, clientX: 0, clientY: 0 });
    fireEvent.click(hitArea!);

    expect(store.getSelection()).toEqual({
      type: 'connections',
      ids: ['connection-1'],
    });
  });

  it('records where the connection was clicked', () => {
    const store = createCanvasStore();

    const { container } = renderLayer(store);

    const hitArea = container.querySelector('.ui-canvas-connection-hit-area');

    fireEvent.mouseDown(hitArea!, { button: 0, clientX: 300, clientY: 50 });
    fireEvent.click(hitArea!, { clientX: 300, clientY: 50 });

    // Anchors the toolbar at the pressed part of the curve
    expect(store.getSelectionPoint()).toEqual({ x: 300, y: 50 });
  });

  it('toggles a connection into the selection with a modifier', () => {
    const store = createCanvasStore();

    const { container } = renderLayer(store);

    act(() => {
      store.selectConnections(['connection-2']);
    });

    const hitArea = container.querySelector('.ui-canvas-connection-hit-area');

    fireEvent.mouseDown(hitArea!, { button: 0, clientX: 0, clientY: 0 });
    fireEvent.click(hitArea!, { shiftKey: true });

    expect(store.getSelectedConnectionIds()).toEqual([
      'connection-2',
      'connection-1',
    ]);
  });

  it('does not select for a press that re-routes the connection', () => {
    const store = createCanvasStore();

    const { container } = renderLayer(store);

    const hitArea = container.querySelector('.ui-canvas-connection-hit-area');

    // Grabbing the curve to re-drag it must not also select it
    fireEvent.mouseDown(hitArea!, { button: 0, clientX: 300, clientY: 50 });

    act(() => {
      window.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 340, clientY: 90 }),
      );
      window.dispatchEvent(new MouseEvent('mouseup'));
    });

    fireEvent.click(hitArea!);

    expect(store.getSelection()).toBeNull();
  });

  it('does not select when the layer is not selectable', () => {
    const store = createCanvasStore();

    const { container } = renderLayer(store, { selectable: false });

    const hitArea = container.querySelector('.ui-canvas-connection-hit-area');

    fireEvent.mouseDown(hitArea!, { button: 0, clientX: 0, clientY: 0 });
    fireEvent.click(hitArea!);

    expect(store.getSelection()).toBeNull();
  });

  it('renders arrowheads according to the arrows setting', () => {
    const store = createCanvasStore();

    const { container } = renderLayer(store, {
      connections: [
        connection,
        {
          id: 'connection-2',
          from: { nodeId: 'node-1', side: 'top' },
          to: { nodeId: 'node-2', side: 'top' },
          arrows: 'both',
        },
        {
          id: 'connection-3',
          from: { nodeId: 'node-1', side: 'bottom' },
          to: { nodeId: 'node-2', side: 'bottom' },
          arrows: 'none',
        },
      ],
    });

    const lines = container.querySelectorAll('.ui-canvas-connection-line');

    // Default: arrow at the target end only
    expect(lines[0].getAttribute('marker-end')).not.toBeNull();
    expect(lines[0].getAttribute('marker-start')).toBeNull();

    // Both ends
    expect(lines[1].getAttribute('marker-end')).not.toBeNull();
    expect(lines[1].getAttribute('marker-start')).not.toBeNull();

    // No arrows
    expect(lines[2].getAttribute('marker-end')).toBeNull();
    expect(lines[2].getAttribute('marker-start')).toBeNull();
  });

  it('renders the preview curve during a connection drag', () => {
    const store = createCanvasStore();

    const { container } = renderLayer(store);

    // Drag from node-1's right side toward a free point
    act(() => {
      store.startConnectionDrag('node-1', 'right', { x: 200, y: 50 });
      store.updateConnectionDrag({ x: 300, y: 80 }, null);
    });

    const preview = container.querySelector('.ui-canvas-connection-preview');

    expect(preview).not.toBeNull();
  });

  it('hides the connection being re-connected', () => {
    const store = createCanvasStore();

    const { container } = renderLayer(store);

    // Start a re-connect drag for the connection
    act(() => {
      store.startConnectionDrag(
        'node-1',
        'right',
        { x: 200, y: 50 },
        { connectionId: 'connection-1', end: 'to' },
      );
      store.updateConnectionDrag({ x: 300, y: 80 }, null);
    });

    // The curve is replaced by the preview for the drag's duration
    expect(container.querySelectorAll('.ui-canvas-connection').length).toBe(0);
    expect(
      container.querySelector('.ui-canvas-connection-preview'),
    ).not.toBeNull();
  });

  it('keeps the arrow direction while re-connecting the source end', () => {
    const store = createCanvasStore();

    const { container } = renderLayer(store);

    // Drag the source end; the preview path runs from the target
    // end toward the cursor, against the connection's direction
    act(() => {
      store.startConnectionDrag(
        'node-2',
        'left',
        { x: 400, y: 50 },
        { connectionId: 'connection-1', end: 'from' },
      );
      store.updateConnectionDrag({ x: 300, y: 80 }, null);
    });

    const preview = container.querySelector('.ui-canvas-connection-preview');

    // The arrow stays at the connection's target end, the path
    // start
    expect(preview?.getAttribute('marker-start')).not.toBeNull();
    expect(preview?.getAttribute('marker-end')).toBeNull();
  });

  it('styles the preview after the re-connected connection', () => {
    const store = createCanvasStore();

    const { container } = renderLayer(store, {
      connections: [{ ...connection, color: 'red', thickness: 'thick' }],
    });

    // Start a re-connect drag for the styled connection
    act(() => {
      store.startConnectionDrag(
        'node-1',
        'right',
        { x: 200, y: 50 },
        { connectionId: 'connection-1', end: 'to' },
      );
      store.updateConnectionDrag({ x: 300, y: 80 }, null);
    });

    const preview = container.querySelector('.ui-canvas-connection-preview');
    const style = preview?.getAttribute('style') || '';

    expect(style).toContain('stroke: var(--red-600)');
    expect(style).toContain('stroke-width: 4');
  });

  it('snaps the preview curve to the hovered target side', () => {
    const store = createCanvasStore();

    const { container } = renderLayer(store);

    // Target node-2's left side mid-drag
    act(() => {
      store.startConnectionDrag('node-1', 'right', { x: 200, y: 50 });
      store.updateConnectionDrag(
        { x: 390, y: 60 },
        { nodeId: 'node-2', side: 'left' },
      );
    });

    const preview = container.querySelector('.ui-canvas-connection-preview');

    // The preview ends at node-2's left midpoint, behind the
    // arrowhead
    expect(preview?.getAttribute('d')).toBe(
      'M 200 50 C 300 50, 300 50, 389 50',
    );
  });
});
