import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, render } from '@minddrop/test-utils';
import { CanvasProvider } from '../CanvasProvider';
import { CanvasStore, createCanvasStore } from '../createCanvasStore';
import { useFitOnNodesReady } from './useFitOnNodesReady';

// A component fitting the view to a single expected node
const FitToNode: React.FC = () => {
  useFitOnNodesReady(['node-1']);

  return null;
};

// Renders the fitting component within a provider backed by the
// given store
const renderFit = (store: CanvasStore) =>
  render(
    <CanvasProvider store={store}>
      <FitToNode />
    </CanvasProvider>,
  );

describe('useFitOnNodesReady', () => {
  afterEach(cleanup);

  it('fits the view once the viewport is measured and the node registered', () => {
    const store = createCanvasStore({ initialZoom: 2 });

    renderFit(store);

    // Nothing to fit to yet
    expect(store.getZoom()).toBe(2);

    // The node registers, then the viewport is measured
    act(() => {
      store.registerNode('node-1', { x: 0, y: 0, width: 100, height: 100 });
      store.setViewportSize({ width: 1000, height: 1000 });
    });

    // The view fitted the node, never zooming in past 100%
    expect(store.getZoom()).toBe(1);
  });

  it('fits only once', () => {
    const store = createCanvasStore();

    renderFit(store);

    act(() => {
      store.setViewportSize({ width: 1000, height: 1000 });
      store.registerNode('node-1', { x: 0, y: 0, width: 100, height: 100 });
    });

    // A later view change is left alone
    act(() => {
      store.setZoom(2);
    });

    expect(store.getZoom()).toBe(2);
  });
});
