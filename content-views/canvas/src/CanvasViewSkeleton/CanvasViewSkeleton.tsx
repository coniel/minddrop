import React from 'react';
import './CanvasViewSkeleton.css';

/**
 * Renders a skeleton placeholder for the canvas view type:
 * scattered card rectangles over a dot grid.
 */
export const CanvasViewSkeleton: React.FC = () => {
  return (
    <div className="canvas-view-skeleton">
      <div
        className="canvas-view-skeleton-card"
        style={{ top: '12%', left: '8%', width: '26%', height: 120 }}
      />
      <div
        className="canvas-view-skeleton-card"
        style={{ top: '48%', left: '16%', width: '22%', height: 90 }}
      />
      <div
        className="canvas-view-skeleton-card"
        style={{ top: '22%', left: '44%', width: '24%', height: 150 }}
      />
      <div
        className="canvas-view-skeleton-card"
        style={{ top: '60%', left: '52%', width: '26%', height: 100 }}
      />
      <div
        className="canvas-view-skeleton-card"
        style={{ top: '10%', left: '74%', width: '20%', height: 110 }}
      />
    </div>
  );
};
