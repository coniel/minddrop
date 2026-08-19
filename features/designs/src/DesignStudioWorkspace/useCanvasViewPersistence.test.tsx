import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@minddrop/test-utils';
import { CanvasProvider, useCanvas } from '@minddrop/ui-canvas';
import {
  TransientViewStateContextValue,
  TransientViewStateProvider,
} from '@minddrop/ui-primitives';
import { createDesignStudioCanvasStore } from '../createDesignStudioCanvasStore';
import { useCanvasViewPersistence } from './useCanvasViewPersistence';

// The view the probe moves to when clicked
const Zoom = 2;
const Pan = { x: -120, y: 40 };

describe('useCanvasViewPersistence', () => {
  afterEach(cleanup);

  it('restores the view when the workspace remounts', () => {
    const { value } = createBag();

    const workspace = render(<CanvasWorkspace value={value} />);

    // Move around the canvas, as panning and zooming does
    fireEvent.click(screen.getByRole('button'));

    // Switch away from the tab, which unmounts the canvas along
    // with its store
    workspace.unmount();

    render(<CanvasWorkspace value={value} />);

    expect(screen.getByRole('button').textContent).toBe(
      `${Zoom}|${Pan.x}|${Pan.y}`,
    );
  });

  it('records the view as it changes', () => {
    const { bag, value } = createBag();

    render(<CanvasWorkspace value={value} />);

    fireEvent.click(screen.getByRole('button'));

    expect(bag['canvas-view']).toEqual({ zoom: Zoom, pan: Pan });
  });

  it('reports whether a view was restored', () => {
    const { value } = createBag({
      'canvas-view': { zoom: Zoom, pan: Pan },
    });

    render(<CanvasWorkspace value={value} />);

    // The workspace fits its layouts into view only when there is
    // no view to return to
    screen.getByText('restored');
  });
});

/**
 * Creates an in-memory state bag and a context value backed by it,
 * standing in for the tab the canvas is rendered in.
 */
function createBag(initial: Record<string, unknown> = {}) {
  const bag: Record<string, unknown> = { ...initial };

  const value: TransientViewStateContextValue = {
    get: (key) => bag[key],
    set: (key, storedValue) => {
      bag[key] = storedValue;
    },
  };

  return { bag, value };
}

/**
 * Renders a canvas on a store of its own, mirroring how the studio
 * creates and mounts one per mount.
 */
const CanvasWorkspace: React.FC<{ value: TransientViewStateContextValue }> = ({
  value,
}) => {
  const [store] = useState(createDesignStudioCanvasStore);

  return (
    <TransientViewStateProvider value={value}>
      <CanvasProvider store={store}>
        <ViewProbe />
      </CanvasProvider>
    </TransientViewStateProvider>
  );
};

/**
 * Renders the canvas view and moves it on click.
 */
const ViewProbe: React.FC = () => {
  const canvas = useCanvas();
  const restored = useCanvasViewPersistence();

  function handleClick() {
    canvas.setZoom(Zoom);
    canvas.setPan(Pan.x, Pan.y);
  }

  return (
    <>
      <button type="button" onClick={handleClick}>
        {`${canvas.getZoom()}|${canvas.getPan().x}|${canvas.getPan().y}`}
      </button>
      {restored && <span>restored</span>}
    </>
  );
};
