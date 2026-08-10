import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, render } from '@minddrop/test-utils';
import { CanvasProvider } from '../CanvasProvider';
import { CanvasStore, createCanvasStore } from '../createCanvasStore';
import { CanvasAlignmentGuides } from './CanvasAlignmentGuides';

// Renders the guides within a canvas provider backed by the given
// store
const renderGuides = (store: CanvasStore) =>
  render(
    <CanvasProvider store={store}>
      <CanvasAlignmentGuides />
    </CanvasProvider>,
  );

describe('CanvasAlignmentGuides', () => {
  afterEach(cleanup);

  it('renders nothing when there are no guides', () => {
    const store = createCanvasStore();

    const { container } = renderGuides(store);

    expect(container.querySelector('.ui-canvas-alignment-guides')).toBeNull();
  });

  it('renders a vertical line for an x axis guide', () => {
    const store = createCanvasStore();

    const { container } = renderGuides(store);

    act(() => {
      store.setAlignmentGuides([
        { axis: 'x', position: 100, start: 20, end: 300 },
      ]);
    });

    const line = container.querySelector('line');

    expect(line?.getAttribute('x1')).toBe('100');
    expect(line?.getAttribute('x2')).toBe('100');
    expect(line?.getAttribute('y1')).toBe('20');
    expect(line?.getAttribute('y2')).toBe('300');
  });

  it('renders a horizontal line for a y axis guide', () => {
    const store = createCanvasStore();

    const { container } = renderGuides(store);

    act(() => {
      store.setAlignmentGuides([
        { axis: 'y', position: 100, start: 20, end: 300 },
      ]);
    });

    const line = container.querySelector('line');

    expect(line?.getAttribute('y1')).toBe('100');
    expect(line?.getAttribute('y2')).toBe('100');
    expect(line?.getAttribute('x1')).toBe('20');
    expect(line?.getAttribute('x2')).toBe('300');
  });

  it('unscales the stroke width by the canvas zoom', () => {
    const store = createCanvasStore({ initialZoom: 2 });

    const { container } = renderGuides(store);

    act(() => {
      store.setAlignmentGuides([
        { axis: 'x', position: 100, start: 20, end: 300 },
      ]);
    });

    expect(container.querySelector('line')?.getAttribute('stroke-width')).toBe(
      '0.5',
    );
  });
});
