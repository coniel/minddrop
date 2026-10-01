import React from 'react';
import { ContentViewTypeComponentProps } from '@minddrop/content-views';
import { CanvasProvider } from '@minddrop/ui-canvas';
import { CanvasViewData, CanvasViewOptions } from '../types';
import { CanvasViewContent } from './CanvasViewContent';
import './CanvasView.css';

/**
 * Renders a canvas view: an infinite pannable/zoomable canvas
 * with freely arranged entry cards.
 */
export const CanvasViewComponent: React.FC<
  ContentViewTypeComponentProps<CanvasViewOptions, CanvasViewData>
> = ({ view, entries }) => (
  <CanvasProvider
    initialSnapToGrid={view.options?.snapToGrid}
    initialSnapToObjects={view.options?.snapToObjects}
  >
    <CanvasViewContent view={view} entries={entries} />
  </CanvasProvider>
);
