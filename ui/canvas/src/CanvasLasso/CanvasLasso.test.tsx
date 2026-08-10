import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, render } from '@minddrop/test-utils';
import { CanvasProvider } from '../CanvasProvider';
import { CanvasStore, createCanvasStore } from '../createCanvasStore';
import { CanvasLasso } from './CanvasLasso';

// Renders the marquee within a canvas provider backed by the
// given store
const renderLasso = (store: CanvasStore) =>
  render(
    <CanvasProvider store={store}>
      <CanvasLasso />
    </CanvasProvider>,
  );

describe('CanvasLasso', () => {
  afterEach(cleanup);

  it('renders nothing when no lasso is in progress', () => {
    const store = createCanvasStore();

    const { container } = renderLasso(store);

    expect(container.querySelector('.ui-canvas-lasso')).toBeNull();
  });

  it('renders the marquee spanning the origin and cursor points', () => {
    const store = createCanvasStore();

    const { container } = renderLasso(store);

    act(() => {
      store.startLasso({ x: 10, y: 20 }, false);
      store.updateLasso({ x: 110, y: 220 });
    });

    const marquee = container.querySelector<HTMLElement>('.ui-canvas-lasso');

    expect(marquee?.style.transform).toBe('translate(10px, 20px)');
    expect(marquee?.style.width).toBe('100px');
    expect(marquee?.style.height).toBe('200px');
  });

  it('normalises a marquee dragged up and to the left', () => {
    const store = createCanvasStore();

    const { container } = renderLasso(store);

    act(() => {
      store.startLasso({ x: 110, y: 220 }, false);
      store.updateLasso({ x: 10, y: 20 });
    });

    const marquee = container.querySelector<HTMLElement>('.ui-canvas-lasso');

    expect(marquee?.style.transform).toBe('translate(10px, 20px)');
    expect(marquee?.style.width).toBe('100px');
    expect(marquee?.style.height).toBe('200px');
  });

  it('unscales the border width by the canvas zoom', () => {
    const store = createCanvasStore({ initialZoom: 2 });

    const { container } = renderLasso(store);

    act(() => {
      store.startLasso({ x: 10, y: 20 }, false);
    });

    expect(
      container.querySelector<HTMLElement>('.ui-canvas-lasso')?.style
        .borderWidth,
    ).toBe('0.5px');
  });
});
