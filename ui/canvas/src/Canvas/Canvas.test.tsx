import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render } from '@minddrop/test-utils';
import { CanvasConnectionsLayer } from '../CanvasConnectionsLayer';
import { CanvasProvider } from '../CanvasProvider';
import { CanvasStore, createCanvasStore } from '../createCanvasStore';
import { CanvasConnection, CanvasSelection } from '../types';
import { Canvas, CanvasProps } from './Canvas';

// Two nodes with a horizontal gap between them, joined by a
// connection running along y = 50 from x = 100 to x = 300
const connection: CanvasConnection = {
  id: 'connection-1',
  from: { nodeId: 'node-1', side: 'right' },
  to: { nodeId: 'node-2', side: 'left' },
};

// Renders a canvas with a connections layer, backed by the given
// store, and returns its viewport element
const renderCanvas = (store: CanvasStore, props: Partial<CanvasProps> = {}) => {
  const { container } = render(
    <CanvasProvider store={store}>
      <Canvas {...props}>
        <CanvasConnectionsLayer connections={[connection]} />
      </Canvas>
    </CanvasProvider>,
  );

  // The nodes the connection joins, registered directly rather
  // than by mounting node components
  act(() => {
    store.registerNode('node-1', { x: 0, y: 0, width: 100, height: 100 });
    store.registerNode('node-2', { x: 300, y: 0, width: 100, height: 100 });
  });

  return {
    container,
    viewport: container.querySelector<HTMLElement>('.ui-canvas-viewport')!,
  };
};

// Presses the canvas background at the given point. The viewport
// element is its own event target, so the press reads as a
// background press.
// Returns false when the press suppressed its default behaviour.
const pressBackground = (
  viewport: HTMLElement,
  clientX: number,
  clientY: number,
  shiftKey = false,
) => fireEvent.mouseDown(viewport, { button: 0, clientX, clientY, shiftKey });

// Dispatches a window mousemove at the given client position
const moveMouse = (clientX: number, clientY: number) => {
  act(() => {
    window.dispatchEvent(new MouseEvent('mousemove', { clientX, clientY }));
  });
};

// Dispatches a window mouseup, ending the interaction
const releaseMouse = () => {
  act(() => {
    window.dispatchEvent(new MouseEvent('mouseup'));
  });
};

describe('Canvas', () => {
  afterEach(cleanup);

  describe('lasso', () => {
    it('selects the nodes the marquee touches', () => {
      const store = createCanvasStore();

      const { viewport } = renderCanvas(store);

      pressBackground(viewport, -10, -10);
      moveMouse(410, 110);
      releaseMouse();

      expect(store.getSelection()).toEqual({
        type: 'nodes',
        ids: ['node-1', 'node-2'],
      });
    });

    it('renders the marquee while dragging and removes it on release', () => {
      const store = createCanvasStore();

      const { container, viewport } = renderCanvas(store);

      pressBackground(viewport, -10, -10);
      moveMouse(410, 110);

      expect(container.querySelector('.ui-canvas-lasso')).not.toBeNull();

      releaseMouse();

      expect(container.querySelector('.ui-canvas-lasso')).toBeNull();
    });

    it('selects the connections the marquee touches', () => {
      const store = createCanvasStore();

      const { viewport } = renderCanvas(store);

      // The gap between the nodes, crossed only by the connection
      pressBackground(viewport, 150, 40);
      moveMouse(250, 60);
      releaseMouse();

      expect(store.getSelection()).toEqual({
        type: 'connections',
        ids: ['connection-1'],
      });
    });

    it('records where the lasso was released', () => {
      const store = createCanvasStore();

      const { viewport } = renderCanvas(store);

      pressBackground(viewport, 150, 40);
      moveMouse(250, 60);
      releaseMouse();

      // Anchors the toolbar where the drag ended
      expect(store.getSelectionPoint()).toEqual({ x: 250, y: 60 });
    });

    it('records no point for a lasso that selects nothing', () => {
      const store = createCanvasStore();

      const { viewport } = renderCanvas(store);

      // Empty canvas below the nodes
      pressBackground(viewport, 0, 400);
      moveMouse(100, 500);
      releaseMouse();

      expect(store.getSelectionPoint()).toBeNull();
    });

    it('selects only the nodes when the marquee touches both', () => {
      const store = createCanvasStore();

      const { viewport } = renderCanvas(store);

      pressBackground(viewport, 50, 40);
      moveMouse(250, 60);
      releaseMouse();

      expect(store.getSelection()).toEqual({
        type: 'nodes',
        ids: ['node-1'],
      });
    });

    it('adds to the existing selection when shift is held', () => {
      const store = createCanvasStore();

      const { viewport } = renderCanvas(store);

      act(() => {
        store.selectNodes(['node-1']);
      });

      pressBackground(viewport, 200, -20, true);
      moveMouse(410, 110);
      releaseMouse();

      expect(store.getSelection()).toEqual({
        type: 'nodes',
        ids: ['node-1', 'node-2'],
      });
    });

    it('drops nodes the shrinking marquee no longer touches', () => {
      const store = createCanvasStore();

      const { viewport } = renderCanvas(store);

      pressBackground(viewport, -10, -10);
      moveMouse(410, 110);
      moveMouse(50, 50);
      releaseMouse();

      expect(store.getSelection()).toEqual({
        type: 'nodes',
        ids: ['node-1'],
      });
    });

    it('suppresses the text selection the press would start', () => {
      const store = createCanvasStore();

      const { viewport } = renderCanvas(store);

      // A selection started on the press carries on painting
      // across the content the marquee is dragged over, so the
      // press has to suppress its default behaviour
      expect(pressBackground(viewport, -10, -10)).toBe(false);

      releaseMouse();
    });

    it('locks the pointer for the duration of the drag', () => {
      const store = createCanvasStore();

      const { viewport } = renderCanvas(store);

      pressBackground(viewport, -10, -10);
      moveMouse(410, 110);

      // Text the marquee sweeps over can neither be selected nor
      // swap the cursor
      expect(document.body.classList.contains('ui-canvas-interacting')).toBe(
        true,
      );

      releaseMouse();

      expect(document.body.classList.contains('ui-canvas-interacting')).toBe(
        false,
      );
    });

    it('hides connection handles while the marquee sweeps past node edges', () => {
      const store = createCanvasStore();

      const { viewport } = renderCanvas(store);

      // The cursor near a node edge reveals its handle
      fireEvent.mouseMove(viewport, { clientX: 105, clientY: 50 });

      expect(store.getHoveredConnectionHandle()).toEqual({
        nodeId: 'node-1',
        side: 'right',
      });

      // The same edge, swept past by a marquee instead
      pressBackground(viewport, 150, 150);
      moveMouse(105, 50);
      fireEvent.mouseMove(viewport, { clientX: 105, clientY: 50 });

      expect(store.getHoveredConnectionHandle()).toBeNull();

      releaseMouse();
    });

    it('clears the selection on a press that does not drag', () => {
      const store = createCanvasStore();

      const { container, viewport } = renderCanvas(store);

      act(() => {
        store.selectNodes(['node-1']);
      });

      pressBackground(viewport, 50, 50);

      // Travel below the drag threshold does not start a lasso
      moveMouse(52, 51);

      expect(container.querySelector('.ui-canvas-lasso')).toBeNull();

      releaseMouse();

      expect(store.getSelection()).toBeNull();
    });

    it('keeps the selection on a shift press that does not drag', () => {
      const store = createCanvasStore();

      const { viewport } = renderCanvas(store);

      act(() => {
        store.selectNodes(['node-1']);
      });

      pressBackground(viewport, 50, 50, true);
      releaseMouse();

      expect(store.getSelection()).toEqual({
        type: 'nodes',
        ids: ['node-1'],
      });
    });

    it('pans instead of selecting while space is held', () => {
      const store = createCanvasStore();

      const { container, viewport } = renderCanvas(store);

      fireEvent.keyDown(viewport, { code: 'Space' });
      pressBackground(viewport, 0, 0);
      moveMouse(100, 50);

      expect(container.querySelector('.ui-canvas-lasso')).toBeNull();
      expect(store.getSelection()).toBeNull();
      expect(store.getPan()).toEqual({ x: 100, y: 50 });

      releaseMouse();
    });

    it('clears the selection immediately when the lasso is disabled', () => {
      const store = createCanvasStore();

      const { container, viewport } = renderCanvas(store, { lasso: false });

      act(() => {
        store.selectNodes(['node-1']);
      });

      pressBackground(viewport, -10, -10);

      expect(store.getSelection()).toBeNull();

      moveMouse(410, 110);

      expect(container.querySelector('.ui-canvas-lasso')).toBeNull();
      expect(store.getSelection()).toBeNull();

      releaseMouse();
    });

    it('does not lasso when the canvas is not selectable', () => {
      const store = createCanvasStore({ selectable: false });

      const { container, viewport } = renderCanvas(store);

      pressBackground(viewport, -10, -10);
      moveMouse(410, 110);

      expect(container.querySelector('.ui-canvas-lasso')).toBeNull();
      expect(store.getSelection()).toBeNull();

      releaseMouse();
    });
  });

  describe('selection', () => {
    it('renders the group box for a multi-node selection', () => {
      const store = createCanvasStore();

      const { container } = renderCanvas(store);

      act(() => {
        store.selectNodes(['node-1', 'node-2']);
      });

      expect(
        container.querySelector('.ui-canvas-selection-box'),
      ).not.toBeNull();
    });

    it('renders no selection toolbar without one supplied', () => {
      const store = createCanvasStore();

      const { container } = renderCanvas(store);

      act(() => {
        store.selectNodes(['node-1']);
      });

      expect(
        container.querySelector('.ui-canvas-selection-toolbar'),
      ).toBeNull();
    });

    it('reports Delete with the current selection', () => {
      const store = createCanvasStore();
      const deleted: CanvasSelection[] = [];

      const { viewport } = renderCanvas(store, {
        onSelectionDelete: (selection) => {
          deleted.push(selection);
        },
      });

      act(() => {
        store.selectNodes(['node-1', 'node-2']);
      });

      fireEvent.keyDown(viewport, { key: 'Delete' });

      expect(deleted).toEqual([{ type: 'nodes', ids: ['node-1', 'node-2'] }]);
    });

    it('reports Backspace the same way', () => {
      const store = createCanvasStore();
      const deleted: CanvasSelection[] = [];

      const { viewport } = renderCanvas(store, {
        onSelectionDelete: (selection) => {
          deleted.push(selection);
        },
      });

      act(() => {
        store.selectConnections(['connection-1']);
      });

      fireEvent.keyDown(viewport, { key: 'Backspace' });

      expect(deleted).toEqual([{ type: 'connections', ids: ['connection-1'] }]);
    });

    it('reports whether shift was held', () => {
      const store = createCanvasStore();
      const modifiers: boolean[] = [];

      const { viewport } = renderCanvas(store, {
        onSelectionDelete: (_selection, options) => {
          modifiers.push(options.shiftKey);
        },
      });

      act(() => {
        store.selectNodes(['node-1']);
      });

      fireEvent.keyDown(viewport, { key: 'Delete' });
      fireEvent.keyDown(viewport, { key: 'Delete', shiftKey: true });

      // Consumers escalate to a stronger deletion on shift
      expect(modifiers).toEqual([false, true]);
    });

    it('does not report Delete without a selection', () => {
      const store = createCanvasStore();
      const deleted: CanvasSelection[] = [];

      const { viewport } = renderCanvas(store, {
        onSelectionDelete: (selection) => {
          deleted.push(selection);
        },
      });

      fireEvent.keyDown(viewport, { key: 'Delete' });

      expect(deleted).toEqual([]);
    });

    it('does not report Delete while typing', () => {
      const store = createCanvasStore();
      const deleted: CanvasSelection[] = [];

      const { container } = renderCanvas(store, {
        onSelectionDelete: (selection) => {
          deleted.push(selection);
        },
      });

      act(() => {
        store.selectNodes(['node-1']);
      });

      // An input within the canvas owns its own Delete presses
      const input = document.createElement('input');

      container.querySelector('.ui-canvas-viewport')?.appendChild(input);
      fireEvent.keyDown(input, { key: 'Delete' });

      expect(deleted).toEqual([]);
    });

    it('renders the supplied selection toolbar above the selection', () => {
      const store = createCanvasStore();

      const { container } = renderCanvas(store, {
        selectionToolbar: (selection) => (
          <div data-testid="toolbar">{selection.ids.join(',')}</div>
        ),
      });

      act(() => {
        store.selectNodes(['node-1']);
      });

      expect(
        container.querySelector('.ui-canvas-selection-toolbar')?.textContent,
      ).toBe('node-1');
    });
  });

  describe('zoom', () => {
    it('exposes the zoom to content as a CSS variable', () => {
      const store = createCanvasStore();

      const { viewport } = renderCanvas(store);

      act(() => {
        store.setZoom(2);
      });

      expect(viewport.style.getPropertyValue('--ui-canvas-zoom')).toBe('2');
    });
  });
});
